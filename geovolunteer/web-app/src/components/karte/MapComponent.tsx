import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import { Form } from "react-bootstrap";
import { Icon } from "leaflet";

interface MapComponentProps {
  address?: string | null;
  position: [number, number] | null;
  radius?: number | null;
  zoom?: number | null;
  MapClickHandler?: React.ComponentType;
}

const MapComponent: React.FC<MapComponentProps> = ({
  address,
  position,
  radius,
  zoom,
  MapClickHandler,
}) => {
  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });
  return (
    <>
      {address && (
        <Form.Group className="mb-3">
          <Form.Text>{<div>Address: {address}</div>}</Form.Text>
        </Form.Group>
      )}
      <MapContainer
        center={position ? [position![0], position![1]] : [48.30639, 14.28611]}
        zoom={zoom ? zoom : 13}
        style={{
          height: "512px",
          width: "100%",
          marginBottom: "2rem",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
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
