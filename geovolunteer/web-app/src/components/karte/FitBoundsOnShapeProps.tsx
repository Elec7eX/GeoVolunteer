import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { GeoJsonFeature } from "../../types/Types";

interface FitBoundsOnShapeProps {
  geoJsonData?: GeoJsonFeature;
  zoom?: number;
}

const FitBoundsOnShape: React.FC<FitBoundsOnShapeProps> = ({
  geoJsonData,
  zoom,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonData) return;

    setTimeout(() => {
      map.invalidateSize();

      if (geoJsonData.geometry.type === "Point") {
        const [lng, lat] = geoJsonData.geometry.coordinates as number[];
        map.setView([lat, lng], zoom || 15, { animate: false });
      } else {
        const layer = L.geoJSON(geoJsonData as any);
        map.fitBounds(layer.getBounds(), {
          padding: [40, 40],
          animate: false,
        });
      }
    }, 50);
  }, [geoJsonData, map, zoom]);

  return null;
};

export default FitBoundsOnShape;
