import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  Circle,
  ZoomControl,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { Icon } from "leaflet";
import { Form } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { GeoJsonGeometry } from "../../types/Types";

interface MapComponentProps {
  address?: string | null;
  position: [number, number] | null;
  radius?: number | null;
  zoom?: number | null;
  MapClickHandler?: React.ComponentType;
  onShapeChange?: (geoJson: GeoJsonGeometry | null) => void; // neue Callback
}

const MapComponent: React.FC<MapComponentProps> = ({
  address,
  position,
  radius,
  zoom,
  MapClickHandler,
  onShapeChange,
}) => {
  const drawnItemsRef = useRef<L.FeatureGroup>(null);
  const [shapeDrawn, setShapeDrawn] = useState(false);
  const [drawnGeoJson, setDrawnGeoJson] = useState<GeoJsonGeometry | null>(
    null
  );

  const onCreated = (e: any) => {
    const layer = e.layer;
    const geoJson = layer.toGeoJSON().geometry as GeoJsonGeometry;
    setDrawnGeoJson(geoJson);
    setShapeDrawn(true);
    console.log("Shape created:", geoJson);
    if (onShapeChange) onShapeChange(geoJson);

    if (layer.bindPopup) {
      layer.bindPopup("<b>Hallo!</b><br>Dies ist ein Popup.").openPopup();
    }
  };

  const onEdited = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      const geoJson = layer.toGeoJSON().geometry as GeoJsonGeometry;
      setDrawnGeoJson(geoJson);
      console.log("Shape edited:", geoJson);
      if (onShapeChange) onShapeChange(geoJson);
    });
  };

  const onDeleted = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      setDrawnGeoJson(null);
      setShapeDrawn(false);
      console.log("Shape deleted:", layer.toGeoJSON());
      if (onShapeChange) onShapeChange(null);
    });
  };

  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  return (
    <>
      {address && (
        <Form.Group className="mb-3">
          <Form.Text>
            <div>Address: {address}</div>
          </Form.Text>
        </Form.Group>
      )}

      <MapContainer
        center={position ? [position[0], position[1]] : [48.30639, 14.28611]}
        zoom={zoom || 13}
        scrollWheelZoom={true}
        zoomControl={false}
        doubleClickZoom={false}
        style={{ height: "512px", width: "100%", marginBottom: "2rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="topright" />
        <FeatureGroup ref={drawnItemsRef}>
          <EditControl
            position="topleft"
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDeleted}
            draw={{
              rectangle: !shapeDrawn,
              polygon: !shapeDrawn,
              circle: !shapeDrawn,
              marker: !shapeDrawn ? { icon: customIcon } : false,
              circlemarker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>

        {MapClickHandler && <MapClickHandler />}

        {position && (
          <Marker position={position} icon={customIcon}>
            {address && <Popup>{address}</Popup>}
          </Marker>
        )}

        {position && radius && (
          <Circle
            center={position}
            radius={radius}
            pathOptions={{ color: "blue" }}
          />
        )}
      </MapContainer>
    </>
  );
};

export default MapComponent;
