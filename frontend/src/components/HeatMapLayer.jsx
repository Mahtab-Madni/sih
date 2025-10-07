import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet.heat";

export const heatmapGradient = {
  0.0: "#003d82",
  0.5: "#1976d2",
  0.75: "#ffa726",
  0.9: "#d32f2f",
  1.0: "#b71c1c",
};

export default function HeatMapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatPoints = points.map((p) => [
      p.lat,
      p.lng,
      Math.min(p.hpi / 200, 1),
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 25,
      maxZoom: 11,
      gradient: heatmapGradient,
      max: 1,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
