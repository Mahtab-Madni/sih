// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const csv = require("csvtojson");
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
require("dotenv").config();

const computeIndices = require("./utils/calculateIndices");

const Sample = require("./models/sample");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- MIDDLEWARE ----------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: ["http://localhost:8080"], 
}));

// ---------- MONGODB ----------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ---------- ROUTES ----------
// ✅ 1. Add a single sample
app.post("/api/samples", async (req, res) => {
  try {
    let sampleData = req.body;

    // Calculate indices
    const indicesResult = computeIndices(sampleData);
    sampleData.indices = {
      hpi: indicesResult.hpi,
      mi: indicesResult.mi,
      cd: indicesResult.cd,
    };
    sampleData.category = indicesResult.category;

    // Set location
    sampleData.location = { 
      type: "Point", 
      coordinates: [sampleData.longitude, sampleData.latitude] 
    };
    
    const newSample = new Sample(sampleData);
    const saved = await newSample.save();
    res.status(201).json({ message: "✅ Sample added", data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding sample" });
  }
});

// ✅ 2. Get all samples
app.get("/api/samples", async (req, res) => {
  try {
    const samples = await Sample.find().sort({ createdAt: -1 });
    res.json(samples);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch samples" });
  }
});

// Route to get sample by ID
app.get('/api/samples/:id', async (req, res) => {
  try {
    const sample = await Sample.findOne({ sampleId: req.params.id });
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }
    res.json(sample);
  } catch (error) {
    console.error('Error fetching sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ 3. Summary stats
app.get("/api/summary", async (req, res) => {
  try {
    const totalSamples = await Sample.countDocuments();

    const categories = await Sample.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const avgIndices = await Sample.aggregate([
      {
        $group: {
          _id: null,
          avgHPI: { $avg: "$indices.hpi" },
          avgMI: { $avg: "$indices.mi" },
          avgCD: { $avg: "$indices.cd" },
        },
      },
    ]);

    res.json({
      totalSamples,
      categories,
      averages: avgIndices[0] || {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

// ✅ 4. Upload CSV (Bulk)// ✅ 4. Upload CSV (Bulk)
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const fs = require("fs");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jsonArray = await csv().fromFile(req.file.path);
    console.log("First row of CSV:", jsonArray[0]);

    const safeParseFloat = (value, multiplier = 1) => {
      if (value === "-" || value === "" || value === null || value === undefined) return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num * multiplier;
    };

    const docs = jsonArray.map((row, index) => {
      const lat = parseFloat(row.Latitude || row.LAT || row.latitude) || 0;
      const lng = parseFloat(row.Longitude || row.LONG || row.longitude) || 0;

      const waterQuality = {
        pH: safeParseFloat(row["pH"]),
        tds: safeParseFloat(row["EC (µS/cm at at 25 °C)"], 0.64),
        fluoride: safeParseFloat(row["F (mg/L)"]),
        nitrate: safeParseFloat(row["NO3"]),
        chloride: safeParseFloat(row["Cl (mg/L)"]),
        sulfate: safeParseFloat(row["SO4"]),
        sodium: safeParseFloat(row["Na (mg/L)"]),
        iron: safeParseFloat(row["Fe (ppm)"]),
        arsenic: safeParseFloat(row["As (ppb)"], 0.001),
        uranium: safeParseFloat(row["U (ppb)"], 0.001),
        calcium: safeParseFloat(row["Ca (mg/L)"]),
        magnesium: safeParseFloat(row["Mg (mg/L)"]),
        potassium: safeParseFloat(row["K (mg/L)"]),
        totalHardness: safeParseFloat(row["Total Hardness"]),
        bicarbonate: safeParseFloat(row["HCO3"]),
        phosphate: safeParseFloat(row["PO4"]),
      };

      // ✅ Properly populate metals object with all available heavy metals
      const metals = {
        arsenic: waterQuality.arsenic || safeParseFloat(row["As (mg/L)"]) || 0,
        uranium: waterQuality.uranium || safeParseFloat(row["U (mg/L)"]) || 0,
        iron: waterQuality.iron || safeParseFloat(row["Fe (mg/L)"]) || 0,
        lead: safeParseFloat(row["Pb (ppb)"], 0.001) || safeParseFloat(row["Pb (mg/L)"]) || 0,
        cadmium: safeParseFloat(row["Cd (ppb)"], 0.001) || safeParseFloat(row["Cd (mg/L)"]) || 0,
        chromium: safeParseFloat(row["Cr (ppb)"], 0.001) || safeParseFloat(row["Cr (mg/L)"]) || 0,
        mercury: safeParseFloat(row["Hg (ppb)"], 0.001) || safeParseFloat(row["Hg (mg/L)"]) || 0,
      };

      const sampleData = {
        sampleId: row["S. No."] || `SAMPLE-${Date.now()}-${index}`,
        state: row.State || "",
        district: row.District || "",
        block: "",
        village: row.Location || "",
        latitude: lat,
        longitude: lng,
        samplingDate: row.Year ? new Date(row.Year, 0, 1) : new Date(),
        wellType: "Groundwater",
        waterQuality,
        metals,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };

      // ✅ Compute HPI, MI, and CD using updated function
      const { hpi, mi, cd, category } = computeIndices(sampleData);
      
      sampleData.indices = {
        hpi: hpi !== null ? hpi : 0,
        mi: mi !== null ? mi : 0,
        cd: cd !== null ? cd : 0,
      };
      sampleData.category = category || "unknown";

      console.log(`Sample ${index}: HPI=${sampleData.indices.hpi}, MI=${sampleData.indices.mi}, CD=${sampleData.indices.cd}, Category=${sampleData.category}`);
      return sampleData;
    });

    const validDocs = docs.filter(doc => doc.latitude !== 0 && doc.longitude !== 0);
    console.log(`Valid samples with coordinates: ${validDocs.length} out of ${docs.length}`);

    await Sample.deleteMany({});
    console.log("🗑️ Cleared previous samples from database");

    const result = await Sample.insertMany(validDocs, { ordered: false });

    fs.unlinkSync(req.file.path);

    console.log(`✅ Successfully uploaded ${result.length} samples`);
    res.json({
      message: "✅ Bulk upload successful",
      count: result.length,
    });
  } catch (err) {
    console.error("Upload error:", err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Failed to upload CSV", details: err.message });
  }
});

// ✅ Export PDF report
app.post('/api/export/pdf', async (req, res) => {
  const { samples, charts } = req.body;
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  doc.pipe(res);

  doc.fontSize(18).text('Groundwater Analysis Report', { align: 'center' }).moveDown();

  // Helper to convert base64 to buffer
  const base64ToBuffer = (base64) => {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  };

  // Embed charts
  if (charts?.pollutionChart) {
    doc.text('Pollution Indices Comparison').moveDown(0.5);
    doc.image(base64ToBuffer(charts.pollutionChart), { fit: [500, 300], align: 'center' }).moveDown();
  }

  if (charts?.pieChart) {
    doc.text('Contamination Distribution').moveDown(0.5);
    doc.image(base64ToBuffer(charts.pieChart), { fit: [500, 300], align: 'center' }).moveDown();
  }

  if (charts?.mapSnapshot) {
    doc.text('Geospatial Visualization').moveDown(0.5);
    doc.image(base64ToBuffer(charts.mapSnapshot), { fit: [500, 300], align: 'center' }).moveDown();
  }

  // Sample details
  samples.forEach((sample, index) => {
    doc.fontSize(12).text(`Sample ${index + 1}: ${sample.sampleId}`);
    doc.text(`Location: ${sample.village}, ${sample.district}, ${sample.state}`);
    doc.text(`Coordinates: ${sample.latitude}, ${sample.longitude}`);
    doc.text(`HPI: ${sample.indices.hpi} | MI: ${sample.indices.mi} | Cd: ${sample.indices.cd}`);
    doc.text(`Status: ${sample.category}`);
    doc.moveDown();
  });

  doc.end();
});

//Export sample PDF report for a single sample
app.post('/api/export/sample-pdf', async (req, res) => {
  const { sample, charts } = req.body;
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Sample_Report_${sample.sampleId}.pdf`);
  doc.pipe(res);

  const base64ToBuffer = (base64) => {
    const data = base64.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(data, 'base64');
  };

  // Title
  doc.fontSize(18).text(`Groundwater Sample Report`, { align: 'center' }).moveDown();
  doc.fontSize(14).text(`Sample ID: ${sample.sampleId}`).moveDown();

  // Location Details
  doc.fontSize(14).text(' Location Details').moveDown(0.5);
  doc.fontSize(12).text(`State: ${sample.state}`);
  doc.text(`District: ${sample.district}`);
  doc.text(`Block: ${sample.block}`);
  doc.text(`Village: ${sample.village}`);
  doc.text(`Latitude: ${sample.latitude}`);
  doc.text(`Longitude: ${sample.longitude}`);
  doc.text(`Geo Coordinates: [${sample.location?.coordinates?.join(', ')}]`);
  doc.moveDown();

  // Sampling Metadata
  doc.fontSize(14).text(' Sampling Information').moveDown(0.5);
  doc.fontSize(12).text(`Sampling Date: ${new Date(sample.samplingDate).toLocaleDateString()}`);
  doc.text(`Well Type: ${sample.wellType}`);
  doc.text(`Category: ${sample.category}`);
  doc.moveDown();

  // Water Quality Parameters
  doc.fontSize(14).text(' Water Quality Parameters').moveDown(0.5);
  const wq = sample.waterQuality;
  doc.fontSize(12).text(`pH: ${wq.pH}`);
  doc.text(`TDS: ${wq.tds} mg/L`);
  doc.text(`Hardness: ${wq.hardness} mg/L`);
  doc.text(`Fluoride: ${wq.fluoride} mg/L`);
  doc.text(`Nitrate: ${wq.nitrate} mg/L`);
  doc.moveDown();

  // Heavy Metals
  doc.fontSize(14).text(' Heavy Metals Concentration').moveDown(0.5);
  const m = sample.metals;
  doc.fontSize(12).text(`Lead: ${m.lead} ppm`);
  doc.text(`Uranium: ${m.uranimun} ppm`);
  doc.text(`Arsenic: ${m.arsenic} ppm`);
  doc.text(`Iron: ${m.iron} ppm`);
  doc.text(`Mercury: ${m.mercury} ppm`);
  doc.text(`Cadmium: ${m.cadmium} ppm`);
  doc.text(`Chromium: ${m.chromium} ppm`);
  doc.moveDown();

  // Pollution Indices
  doc.fontSize(14).text(' Pollution Indices').moveDown(0.5);
  const idx = sample.indices;
  doc.fontSize(12).text(`HPI (Heavy Metal Pollution Index): ${idx.hpi}`);
  doc.text(`MI (Metal Index): ${idx.mi}`);
  doc.text(`Cd (Contamination Degree): ${idx.cd}`);
  doc.moveDown();

  // Charts Section
  if (charts?.pollutionChar) {
    doc.fontSize(14).text(' Water Quality Chart').moveDown(0.5);
    doc.image(base64ToBuffer(charts.pollutionChar), { fit: [500, 300], align: 'center' }).moveDown();
  }

  if (charts?.pieChar) {
    doc.fontSize(14).text(' Heavy Metals Distribution').moveDown(0.5);
    doc.image(base64ToBuffer(charts.pieChar), { fit: [500, 300], align: 'center' }).moveDown();
  }

  if (charts?.indexChar) {
    doc.fontSize(14).text(' Indices Comparison').moveDown(0.5);
    doc.image(base64ToBuffer(charts.indexChar), { fit: [500, 300], align: 'center' }).moveDown();
  }

  doc.end();
});

app.get('/api/export/csv', async (req, res) => {
  try {
    const samples = await Sample.find({}).lean();

    const formatted = samples.map((s) => ({
      SampleID: s.sampleId,
      State: s.state,
      District: s.district,
      Block: s.block,
      Village: s.village,
      Latitude: s.latitude,
      Longitude: s.longitude,
      SamplingDate: s.samplingDate ? new Date(s.samplingDate).toLocaleDateString() : '',
      WellType: s.wellType,
      Category: s.category,
      pH: s.waterQuality?.pH,
      TDS: s.waterQuality?.tds,
      Hardness: s.waterQuality?.hardness,
      Fluoride: s.waterQuality?.fluoride,
      Nitrate: s.waterQuality?.nitrate,
      Lead: s.metals?.lead,
      Uranium: s.metals?.uranimun,
      Arsenic: s.metals?.arsenic,
      Iron: s.metals?.iron,
      Mercury: s.metals?.mercury,
      Cadmium: s.metals?.cadmium,
      Chromium: s.metals?.chromium,
      HPI: s.indices?.hpi,
      MI: s.indices?.mi,
      Cd: s.indices?.cd,
    }));

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header('Content-Type', 'text/csv');
    res.attachment('Water_Analysis_Data.csv');
    res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).json({ error: 'Failed to generate CSV', details: err.message });
  }
});

// ✅ 5. Chart data: pollution indices trend
app.get("/api/charts/pollution-indices", async (req, res) => {
  try {
    const data = await Sample.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgHPI: { $avg: "$indices.hpi" },
          avgMI: { $avg: "$indices.mi" },
          avgCD: { $avg: "$indices.cd" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});

// ✅ 6. Contamination distribution (per metal)
app.get("/api/contamination-distribution", async (req, res) => {
  try {
    const distribution = await Sample.aggregate([
      {
        $group: {
          _id: null,
          avgLead: { $avg: "$metals.lead" },
          avgCadmium: { $avg: "$metals.cadmium" },
          avgArsenic: { $avg: "$metals.arsenic" },
          avgChromium: { $avg: "$metals.chromium" },
        },
      },
    ]);
    res.json(distribution[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contamination data" });
  }
});

// ✅ 7. Map data - FIXED to handle null/zero HPI properly
app.get("/api/map", async (req, res) => {
  try {
    const geoData = await Sample.find(
      {},
      {
        sampleId: 1,
        latitude: 1,
        longitude: 1,
        category: 1,
        "indices.hpi": 1,
      }
    );

    const mapData = geoData
      .filter(s => s.latitude !== 0 && s.longitude !== 0) // Filter out invalid coordinates
      .map((s) => ({
        id: s._id,
        sampleId: s.sampleId,
        lat: s.latitude,
        lng: s.longitude,
        category: s.category || "unknown",
        hpi: s.indices?.hpi ?? 0, // Use nullish coalescing to preserve 0 values
      }));

    console.log(`Returning ${mapData.length} map samples`);
    res.json(mapData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch map data" });
  }
});

// Update a sample
app.put("/api/samples/:id", async (req, res) => {
  try {
    const sampleId = req.params.id;
    const updates = req.body;

    if (updates.latitude && updates.longitude) {
      updates.location = { type: "Point", coordinates: [updates.longitude, updates.latitude] };
    }

    // Recompute indices if waterQuality or metals changed
    if (updates.waterQuality || updates.metals) {
      const indices = computeIndices(updates);
      updates.indices = {
        hpi: indices.hpi,
        mi: indices.mi,
        cd: indices.cd,
      };
      updates.category = indices.category;
    }

    const updated = await Sample.findByIdAndUpdate(sampleId, updates, { new: true });
    res.json({ message: "✅ Sample updated", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update sample" });
  }
});

// ✅ Update a sample by sampleId (user-friendly)
app.put("/api/samples/by-sampleid/:sampleId", async (req, res) => {
  try {
    const { sampleId } = req.params;
    const updates = req.body;

    // Find the sample by sampleId first
    const existingSample = await Sample.findOne({ sampleId: sampleId });
    
    if (!existingSample) {
      return res.status(404).json({ error: `Sample with sampleId '${sampleId}' not found` });
    }

    // Update location if coordinates changed
    if (updates.latitude && updates.longitude) {
      updates.location = { 
        type: "Point", 
        coordinates: [updates.longitude, updates.latitude] 
      };
    }

    // Recompute indices if metals or waterQuality changed
    if (updates.metals || updates.waterQuality) {
      // Merge existing data with updates for calculation
      const dataForCalculation = {
        metals: updates.metals || existingSample.metals,
        waterQuality: updates.waterQuality || existingSample.waterQuality
      };
      
      const indices = computeIndices(dataForCalculation);
      updates.indices = {
        hpi: indices.hpi,
        mi: indices.mi,
        cd: indices.cd,
      };
      updates.category = indices.category;
    }

    // Update the sample
    const updated = await Sample.findOneAndUpdate(
      { sampleId: sampleId }, 
      updates, 
      { new: true }
    );
    
    res.json({ 
      message: `✅ Sample '${sampleId}' updated successfully`, 
      data: updated 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update sample" });
  }
});

// Delete a sample
app.delete("/api/samples/:id", async (req, res) => {
  try {
    const deleted = await Sample.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Sample not found" });
    res.json({ message: "✅ Sample deleted", data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete sample" });
  }
});

// ✅ 8. Get samples by state/district
app.get("/api/samples/location", async (req, res) => {
  try {
    const { state, district } = req.query;
    const query = {};
    if (state) query.state = state;
    if (district) query.district = district;
    
    const samples = await Sample.find(query).sort({ createdAt: -1 });
    res.json(samples);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch samples by location" });
  }
});

// ✅ 9. Get unique states and districts
app.get("/api/locations", async (req, res) => {
  try {
    const states = await Sample.distinct("state");
    const districts = await Sample.distinct("district");
    res.json({ states, districts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// ✅ 10. Water quality distribution
app.get("/api/water-quality-distribution", async (req, res) => {
  try {
    const distribution = await Sample.aggregate([
      {
        $group: {
          _id: null,
          avgpH: { $avg: "$waterQuality.pH" },
          avgTDS: { $avg: "$waterQuality.tds" },
          avgFluoride: { $avg: "$waterQuality.fluoride" },
          avgNitrate: { $avg: "$waterQuality.nitrate" }
        }
      }
    ]);
    res.json(distribution[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch water quality data" });
  }
});

app.post("/api/fix-categories", async (req, res) => {
  try {
    const samples = await Sample.find({});
    let updatedCount = 0;

    for (const s of samples) {
      const { hpi, category } = computeIndices(s.toObject());
      s.indices.hpi = hpi;
      s.category = category;
      await s.save();
      updatedCount++;
    }

    res.json({ message: "✅ Categories updated", updated: updatedCount });
  } catch (err) {
    console.error("Fix error:", err);
    res.status(500).json({ error: "Failed to update categories" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));