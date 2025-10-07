// utils/calculateIndices.js

// BIS Standards for HPI calculation
const BIS_LIMITS = {
  arsenic: 0.01,
  uranium: 0.03,
  iron: 0.3,
  fluoride: 1.0,
  nitrate: 45,
};

// BIS Standards for Heavy Metals (MI calculation)
const BIS_METAL_LIMITS = {
  lead: 0.01,      // mg/L
  cadmium: 0.003,  // mg/L
  arsenic: 0.01,   // mg/L
  chromium: 0.05,  // mg/L
  mercury: 0.001,  // mg/L
  uranium: 0.03,   // mg/L
  iron: 0.3,       // mg/L
};

// Calculate HPI weights
const RAW_WEIGHTS = Object.fromEntries(
  Object.entries(BIS_LIMITS).map(([key, limit]) => [key, 1 / limit])
);

const TOTAL_WEIGHT = Object.values(RAW_WEIGHTS).reduce((sum, w) => sum + w, 0);

const NORMALIZED_WEIGHTS = Object.fromEntries(
  Object.entries(RAW_WEIGHTS).map(([key, w]) => [key, (w / TOTAL_WEIGHT) * 100])
);

function computeIndices(sample = {}) {
  const { waterQuality = {}, metals = {} } = sample;
  
  // ========== HPI CALCULATION ==========
  let numerator = 0;
  let denominator = 0;

  Object.entries(BIS_LIMITS).forEach(([key, limit]) => {
    let val = waterQuality[key];
    if (val === null || val === undefined || isNaN(val)) return;

    let Qi = (val / limit) * 100;
    const weight = NORMALIZED_WEIGHTS[key];
    numerator += Qi * weight;
    denominator += weight;
  });

  const hpi = denominator > 0 ? Number((numerator / denominator).toFixed(3)) : null;

  // ========== MI CALCULATION (Metal Index) ==========
  let miSum = 0;
  let miCount = 0;

  Object.entries(BIS_METAL_LIMITS).forEach(([key, limit]) => {
    const val = metals[key];
    if (val === null || val === undefined || isNaN(val) || val === 0) return;
    
    const metalRatio = val / limit;
    miSum += metalRatio;
    miCount++;
  });

  const mi = miCount > 0 ? Number((miSum / miCount).toFixed(3)) : null;

  // ========== CD CALCULATION (Contamination Degree) ==========
  let cdSum = 0;
  let cdCount = 0;

  Object.entries(BIS_METAL_LIMITS).forEach(([key, limit]) => {
    const val = metals[key];
    if (val === null || val === undefined || isNaN(val) || val === 0) return;
    
    const contaminationFactor = val / limit;
    cdSum += contaminationFactor;
    cdCount++;
  });

  const cd = cdCount > 0 ? Number(cdSum.toFixed(3)) : null;

  // ========== CATEGORY DETERMINATION ==========
  // Category is determined ONLY by HPI
  let category = "safe";
  if (hpi !== null) {
    if (hpi >= 200) category = "unsafe";
    else if (hpi >= 100) category = "moderate";
    else category = "safe";
  }

  return { 
    hpi, 
    mi: mi !== null ? mi : 0, 
    cd: cd !== null ? cd : 0, 
    category 
  };
}

module.exports = computeIndices;