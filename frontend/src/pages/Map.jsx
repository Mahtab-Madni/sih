import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/map`)
      .then(res => res.json())
      .then(data => setMapData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer center={[20, 77]} zoom={5} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {mapData.map((sample) => (
          <Marker key={sample.id} position={[sample.lat, sample.lng]}>
            <Popup>
              <div>
                <strong>{sample.sampleId}</strong>
                <p>Category: {sample.category}</p>
                <p>HPI: {sample.hpi}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
