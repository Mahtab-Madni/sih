// Data processing utilities for water quality analysis


// Generate monthly trend data for heavy metals
export const generateTrendData = (averageData) => {
  const months = ['2020', '2021', '2022', '2023', '2024'];

  if (!averageData) return [];

  const baseValues = {
    Ca: averageData.avgCalcium || 0.008,
    Mg: averageData.avgMagnesium || 0.012,
    Fe: averageData.avgIron || 0.018,
    As: averageData.avgArsenic || 0.015,
    U: averageData.avgUranium || 0.025,
    K : averageData.avgPotassium || 0.005,
  };

  return months.map((month, index) => {
    const variation = 0.15;
    const trend = index / months.length;

    return {
      name: month,
      Ca: parseFloat((baseValues.Ca * (1 + (Math.random() * variation * 2 - variation) + trend * 0.1)).toFixed(4)),
      Mg: parseFloat((baseValues.Mg * (1 + (Math.random() * variation * 2 - variation) - trend * 0.05)).toFixed(4)),
      Fe: parseFloat((baseValues.Fe * (1 + (Math.random() * variation * 2 - variation) + trend * 0.15)).toFixed(4)),
      As: parseFloat((baseValues.As * (1 + (Math.random() * variation * 2 - variation) - trend * 0.1)).toFixed(4)),
      U: parseFloat((baseValues.U * (1 + (Math.random() * variation * 2 - variation) + trend * 0.2)).toFixed(4)),
      K: parseFloat((baseValues.K * (1 + (Math.random() * variation * 2 - variation) - trend * 0.15)).toFixed(4))
    };
  });
};

// Generate metal concentration data for donut chart
export const generateMetalConcentrationData = (averageData) => {
  const metalColors = {
    Iron: '#3b82f6',
    Flouride: '#8b5cf6',
    Phosphate: '#10b981',
    Nitrate: '#6b7280',
    Bicarbonate: '#6366f1',
    Cadmium: '#ec4899',
    Chromium: '#f97316',
    Arsenic: '#eab308',
    Sulfate: '#14b8a6',
    Zinc: '#ef4444',
    Chloride: '#22c55e'
  };

  if (!averageData) return [];

  const metalKeys = Object.keys(metalColors);
  const metalValues = metalKeys.map((metal) => {
    const key = `avg${metal}`;
    return {
      metal,
      value: parseFloat((averageData[key] || 0).toFixed(4))
    };
  }).filter(item => item.value > 0);

  const total = metalValues.reduce((sum, item) => sum + item.value, 0);

  return metalValues.map(({ metal, value }) => ({
    name: `${metal} (${metal.substring(0, 2)})`,
    value,
    percentage: parseFloat(((value / total) * 100).toFixed(1)),
    color: metalColors[metal] || '#888888'
  })).sort((a, b) => b.value - a.value);
};


// Get highest and lowest metal concentrations
export const getExtremeConcentrations = (data) => {
  if (!data || data.length === 0) {
    return { highest: null, lowest: null };
  }

  const sorted = [...data].sort((a, b) => b.value - a.value);
  return {
    highest: sorted[0],
    lowest: sorted[sorted.length - 1]
  };
};
