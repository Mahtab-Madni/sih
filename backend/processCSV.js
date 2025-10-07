// processCSV.js

const csv = require("csvtojson");
const { Parser } = require("json2csv");
const fs = require("fs");
const computeIndices = require("./utils/calculateIndices");

function safeParse(val, multiplier = 1) {
  if (val === "-" || val === "" || val === null || val === undefined) {
    return null;
  }
  const num = Number(val);
  return isNaN(num) ? null : num * multiplier;
}

async function processCSV(filePath, outputPath) {
  const jsonArray = await csv().fromFile(filePath);

  const results = jsonArray
    .map((row, idx) => {
      // Prepare water quality for HPI
      const waterQuality = {
        pH: safeParse(row["pH"]),
        tds: safeParse(row["EC (µS/cm at at 25 °C)"], 0.64),
        fluoride: safeParse(row["F (mg/L)"]),
        nitrate: safeParse(row["NO3"]),
        chloride: safeParse(row["Cl (mg/L)"]),
        sulfate: safeParse(row["SO4"]),
        sodium: safeParse(row["Na (mg/L)"]),
        iron: safeParse(row["Fe (ppm)"]),
        arsenic: safeParse(row["As (ppb)"], 0.001),
        uranium: safeParse(row["U (ppb)"], 0.001),
        calcium: safeParse(row["Ca (mg/L)"]),
        magnesium: safeParse(row["Mg (mg/L)"]),
        potassium: safeParse(row["K (mg/L)"]),
        totalHardness: safeParse(row["Total Hardness"]),
        bicarbonate: safeParse(row["HCO3"]),
        phosphate: safeParse(row["PO4"]),
      };

      // Metals for MI/CD (convert ppb → mg/L if needed)
      const metals = {
        lead: safeParse(row["Pb (ppb)"], 0.001) ?? safeParse(row["Pb (mg/L)"]),
        cadmium: safeParse(row["Cd (ppb)"], 0.001) ?? safeParse(row["Cd (mg/L)"]),
        arsenic: safeParse(row["As (ppb)"], 0.001) ?? safeParse(row["As (mg/L)"]),
        chromium: safeParse(row["Cr (ppb)"], 0.001) ?? safeParse(row["Cr (mg/L)"]),
        mercury: safeParse(row["Hg (ppb)"], 0.001) ?? safeParse(row["Hg (mg/L)"]),
        uranium: safeParse(row["U (ppb)"], 0.001) ?? safeParse(row["U (mg/L)"]),
        iron: safeParse(row["Fe (ppb)"], 0.001) ?? safeParse(row["Fe (mg/L)"]),
      };

      const { hpi, category, mi, cd } = computeIndices({ waterQuality, metals });

      if (hpi === null || hpi === undefined || isNaN(hpi)) {
        console.log(`⚠️ Skipping sample at ${row["Location"]} — HPI calculation failed`);
        return null;
      }

      return {
        "S. No.": idx + 1,
        State: row["State"],
        District: row["District"],
        Location: row["Location"],
        Longitude: safeParse(row["Longitude"]),
        Latitude: safeParse(row["Latitude"]),
        Year: row["Year"],

        // Raw water quality
        "pH": row["pH"],
        "EC (µS/cm)": row["EC (µS/cm at at 25 °C)"],
        "F (mg/L)": row["F (mg/L)"],
        "NO3": row["NO3"],
        "Cl (mg/L)": row["Cl (mg/L)"],
        "SO4": row["SO4"],
        "PO4": row["PO4"],
        "Total Hardness": row["Total Hardness"],
        "Ca (mg/L)": row["Ca (mg/L)"],
        "Mg (mg/L)": row["Mg (mg/L)"],
        "Na (mg/L)": row["Na (mg/L)"],
        "K (mg/L)": row["K (mg/L)"],
        "Fe (ppm)": row["Fe (ppm)"],
        "As (ppb)": row["As (ppb)"],
        "U (ppb)": row["U (ppb)"],

        // Metals converted to mg/L for reference
        "Pb (mg/L)": metals.lead ?? "-",
        "Cd (mg/L)": metals.cadmium ?? "-",
        "Cr (mg/L)": metals.chromium ?? "-",
        "Hg (mg/L)": metals.mercury ?? "-",
        "Fe (mg/L)": metals.iron ?? "-",
        "As (mg/L)": metals.arsenic ?? "-",
        "U (mg/L)": metals.uranium ?? "-",

        // Computed indices
        HPI: hpi,
        MI: mi,
        CD: cd,
        Category: category,
      };
    })
    .filter(Boolean);

  if (results.length === 0) {
    console.log("❌ No valid HPI samples found in data.");
  } else {
    const parser = new Parser();
    const csvData = parser.parse(results);
    fs.writeFileSync(outputPath, csvData);
    console.log(`✅ ${results.length} valid samples exported to ${outputPath}`);
  }
}

processCSV("./samples.csv", "./hpi_results.csv");
