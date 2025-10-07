const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema({
  sampleId: { type: String, required: true, unique: true },
  
  // Location details
  state: { type: String },
  district: { type: String },
  block: { type: String },
  village: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  
  // Water quality parameters - EXPANDED to match calculateIndices.js
  waterQuality: {
    pH: { type: Number, default: null },
    tds: { type: Number, default: null },
    fluoride: { type: Number, default: null },
    nitrate: { type: Number, default: null },
    chloride: { type: Number, default: null },
    sulfate: { type: Number, default: null },
    sodium: { type: Number, default: null },
    iron: { type: Number, default: null },
    arsenic: { type: Number, default: null },
    uranium: { type: Number, default: null },
    calcium: { type: Number, default: null },
    magnesium: { type: Number, default: null },
    potassium: { type: Number, default: null },
    totalHardness: { type: Number, default: null },
    bicarbonate: { type: Number, default: null },
    phosphate: { type: Number, default: null },
    
    // Keep legacy field for backward compatibility
    hardness: { type: Number, default: null }
  },
  
  // Heavy metals
  metals: {
    lead: { type: Number, default: 0 },
    cadmium: { type: Number, default: 0 },
    arsenic: { type: Number, default: 0 },
    chromium: { type: Number, default: 0 },
    mercury: { type: Number, default: 0 },
    uranium: { type: Number, default: 0 },
    iron: { type: Number, default: 0 }
  },
  
  // Pollution indices
  indices: {
    hpi: { type: Number, default: null },
    mi: { type: Number, default: null },
    cd: { type: Number, default: null }
  },
  category: { type: String, enum: ["safe", "moderate", "unsafe", "unknown"], default: "unknown" },
  
  // Sampling details
  samplingDate: { type: Date },
  wellType: { type: String }
}, { timestamps: true });

// Indexes for geospatial queries and filtering
sampleSchema.index({ location: "2dsphere" });
sampleSchema.index({ category: 1 });
sampleSchema.index({ state: 1, district: 1 });
sampleSchema.index({ "indices.hpi": 1 });

module.exports = mongoose.model("Sample", sampleSchema);