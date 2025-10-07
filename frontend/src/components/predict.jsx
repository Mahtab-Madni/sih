import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  generateTrendData,
  generateMetalConcentrationData,
  getExtremeConcentrations,
} from '@/lib/dataUtils';

const Analytics = () => {
  const [metrics, setMetrics] = useState({ hpi: 0, hei: 0, cd: 0 });
  const [trendData, setTrendData] = useState([]);
  const [metalData, setMetalData] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [extremeValues, setExtremeValues] = useState({ highest: null, lowest: null });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/averages`);
        const data = res.data.data;        

        // Generate chart data
        const trends = generateTrendData(data);
        setTrendData(trends);

        const metals = generateMetalConcentrationData(data);
        setMetalData(metals);
        setSelectedMetal((prev) => prev || (metals.length > 0 ? metals[0] : null));

        const extremes = getExtremeConcentrations(metals);
        setExtremeValues(extremes);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      }
    };

    fetchAnalytics();
  }, []);

  const handleMetalSelect = (metal) => setSelectedMetal(metal);

  const renderTrendLines = () => {
    if (!trendData || trendData.length === 0) return null;

    const maxValue = Math.max(
      ...trendData.map((item) => Math.max(item.As || 0, item.Cd || 0, item.Cr || 0, item.Hg || 0, item.Pb || 0)),
      1
    );

    const colors = { As: '#eab308', Cd: '#ec4899', Cr: '#ef4444', Hg: '#8b5cf6', Pb: '#3b82f6' };
    const n = trendData.length;

    return Object.entries(colors).map(([metal, color]) => {
      const points = trendData
        .map((item, idx) => {
          const value = item[metal] || 0;
          const x = n === 1 ? 50 : (idx / (n - 1)) * 100;
          const y = 100 - (value / maxValue) * 100;
          return `${x},${y}`;
        })
        .join(' ');

      return (
        <polyline
          key={metal}
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Heavy Metal Concentration Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <div className="w-full h-full border rounded p-4">
                <div className="flex justify-between mb-2 text-xs">
                  {(trendData || []).map((t, i) => (
                    <div key={t.name || i}>{t.name}</div>
                  ))}
                </div>

                <div className="relative h-[260px] w-full">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.2" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.2" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.2" />
                    <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.2" />
                    {renderTrendLines()}
                  </svg>
                </div>

                {/* Legend Section */}
                <div className="mt-6 text-xs flex flex-wrap gap-4">
                  {Object.entries({
                    As: '#eab308',
                    Cd: '#ec4899',
                    Cr: '#ef4444',
                    Hg: '#8b5cf6',
                    Pb: '#3b82f6',
                  }).map(([metal, color]) => (
                    <div key={metal} className="flex items-center gap-1">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span>{metal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* <Card>
          <CardHeader>
            <CardTitle>Metal Concentrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metalData.length === 0 && <div className="text-sm text-muted-foreground">No metal data available</div>}

              {metalData.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: m.color }} />
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.value}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">{m.percentage}%</div>
                    <button className="text-xs text-primary underline" onClick={() => handleMetalSelect(m)}>
                      Select
                    </button>
                  </div>
                </div>
              ))}

              {selectedMetal && (
                <div className="mt-4 p-3 border rounded bg-gray-50">
                  <div className="text-sm font-semibold">Selected: {selectedMetal.name}</div>
                  <div className="text-xs">Value: {selectedMetal.value}</div>
                  <div className="text-xs">Share: {selectedMetal.percentage}%</div>
                </div>
              )}

              {extremeValues.highest && (
                <div className="mt-4 p-3 border rounded">
                  <div className="text-sm font-semibold">Highest concentration</div>
                  <div className="text-xs">{extremeValues.highest.name} — {extremeValues.highest.value}</div>
                </div>
              )}

              {extremeValues.lowest && (
                <div className="mt-2 p-3 border rounded">
                  <div className="text-sm font-semibold">Lowest concentration</div>
                  <div className="text-xs">{extremeValues.lowest.name} — {extremeValues.lowest.value}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};
export default Analytics;