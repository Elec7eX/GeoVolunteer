import { useEffect, useRef } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import { Feature, Geometry } from "geojson";

interface FitBoundsOnShapeProps {
  geoJson?: Feature<Geometry, any> | null;
}

const FitBoundsOnShape: React.FC<FitBoundsOnShapeProps> = ({ geoJson }) => {
  const map = useMap();
  const geoJsonLayerRef = useRef<L.GeoJSON<any>>(null);

  useEffect(() => {
    if (!geoJson) return;

    const layer = geoJsonLayerRef.current;
    if (!layer) return;

    setTimeout(() => {
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, 100);
  }, [geoJson, map]);

  if (!geoJson) return null;

  return (
    <GeoJSON
      data={geoJson as any}
      ref={geoJsonLayerRef}
      pointToLayer={(feature, latlng) => {
        if (feature.properties?.radius) {
          return L.circle(latlng, {
            radius: feature.properties.radius,
            color: "red",
          });
        }
        return L.marker(latlng);
      }}
      style={{ color: "blue" }}
    />
  );
};

export default FitBoundsOnShape;
