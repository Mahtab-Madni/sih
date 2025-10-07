import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import HeatMapLayer from "./HeatMapLayer";

const getColorByHPI = (hpi) => {
  if (hpi <= 100) return "#0d47a1"; // Safe: Deep Blue
  if (hpi <= 200) return "#ff6f00"; // Moderate: Orange
  return "#d32f2f";                 // Unsafe: Red
};

export default function MapView() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetch(`/api/map`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const validSamples = data
          .map((s) => ({
            ...s,
            lat: typeof s.lat === 'string' ? parseFloat(s.lat) : s.lat,
            lng: typeof s.lng === 'string' ? parseFloat(s.lng) : s.lng,
            hpi: typeof s.hpi === 'string' ? parseFloat(s.hpi) : s.hpi,
          }))
          .filter((s) => {
            const isValid = 
              s.lat !== 0 &&
              s.lng !== 0 &&
              !isNaN(s.lat) &&
              !isNaN(s.lng) &&
              s.hpi != null &&
              !isNaN(s.hpi) &&
              s.hpi >= 0;
            return isValid;
          });
        if (validSamples.length === 0) {
          setError("No valid HPI samples found in the data");
        } else {
          setSamples(validSamples);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to fetch data: ${err.message}`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center"><h2>Loading map data...</h2></div>;
  if (error) return <div className="flex h-screen flex-col items-center justify-center"><h2>❌ Error loading map</h2><p>{error}</p></div>;
  if (samples.length === 0) return <div className="flex h-screen flex-col items-center justify-center"><h2>📍 No samples to display</h2><p>Upload some CSV data first!</p></div>;

  const center = [20.5937, 78.9629];

  const filteredSamples = filterCategory === "all" 
    ? samples 
    : samples.filter(s => s.category === filterCategory);

  const categoryCounts = {
    safe: samples.filter(s => s.hpi <= 100).length,
    moderate: samples.filter(s => s.hpi > 100 && s.hpi <= 200).length,
    unsafe: samples.filter(s => s.hpi > 200).length,
  };

  const buttonStyle = (active) => ({
    background: active ? "#E74C3C" : "#f1f1f1",
    color: active ? "#fff" : "#444",
    marginRight: "8px",
    padding: "8px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: active ? "0 2px 4px rgba(231,76,60,0.25)" : undefined,
  });

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000, background: "white", padding: "12px 16px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", fontSize: "13px" }}>
        <div><strong>Total Samples: {samples.length}</strong></div>
        <div style={{ marginTop: "8px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "12px", height: "12px", background: "#003d82", borderRadius: "50%" }}></span>
            <span>Safe: {categoryCounts.safe}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span style={{ width: "12px", height: "12px", background: "#ffa726", borderRadius: "50%" }}></span>
            <span>Moderate: {categoryCounts.moderate}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span style={{ width: "12px", height: "12px", background: "#d32f2f", borderRadius: "50%" }}></span>
            <span>Unsafe: {categoryCounts.unsafe}</span>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 160, right: 10, zIndex: 1000, background: "white", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button style={buttonStyle(showHeatmap)} onClick={() => setShowHeatmap((prev) => !prev)}>
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>
        <button style={buttonStyle(showMarkers)} onClick={() => setShowMarkers((prev) => !prev)}>
          {showMarkers ? "Hide Markers" : "Show Markers"}
        </button>
        <div style={{ borderTop: "1px solid #ddd", paddingTop: "8px", marginTop: "4px" }}>
          <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>Filter:</div>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
          >
            <option value="all">All Samples</option>
            <option value="safe">Safe Only</option>
            <option value="moderate">Moderate Only</option>
            <option value="unsafe">Unsafe Only</option>
          </select>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 1000, background: "white", padding: "10px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.4", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", width: "180px" }}>
        <b>HPI Legend</b>
        <div style={{ height: "12px", margin: "6px 0", background: "linear-gradient(to right, #003d82, #1976d2, #ffa726, #d32f2f)", borderRadius: "6px" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
          <span>0</span>
          <span>100</span>
          <span>200</span>
          <span>300+</span>
        </div>
      </div>

      <MapContainer center={center} zoom={5} style={{ height: "100%", width: "100%" }} attributionControl={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {showHeatmap && <HeatMapLayer points={filteredSamples} />}

        {showMarkers && (
          <MarkerClusterGroup>
            {filteredSamples.map((s) => (
              <CircleMarker
                key={s.id}
                center={[s.lat, s.lng]}
                radius={8}
                pathOptions={{
                  color: getColorByHPI(s.hpi),
                  fillColor: getColorByHPI(s.hpi),
                  fillOpacity: 0.6,
                  weight: 1,
                  opacity: 0.8,
                }}
              >
                <Popup>
                  <div>
                    <b>Sample ID:</b> {s.sampleId} <br />
                    <b>Location:</b> {s.lat.toFixed(4)}, {s.lng.toFixed(4)} <br />
                    <b>Category:</b>{" "}
                    <span style={{ color: getColorByHPI(s.hpi), fontWeight: "bold" }}>
                      {s.category.toUpperCase()}
                    </span>{" "}
                    <br />
                    <b>HPI:</b> {s.hpi.toFixed(2)}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}
