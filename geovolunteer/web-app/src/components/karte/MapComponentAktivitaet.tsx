import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  Circle,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L, { Icon } from "leaflet";
import { Form } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { GeoJsonFeature } from "../../types/Types";
import { Feature, Geometry } from "geojson";
import FitBoundsOnShape from "./FitBoundsOnShapeProps";

interface MapComponentProps {
  address?: string | null;
  position?: [number, number] | null;
  radius?: number | null;
  zoom?: number | null;
  MapClickHandler?: React.ComponentType;
  drawShape?: boolean;
  geoJsonData?: GeoJsonFeature;
  onShapeChange?: (geoJson: GeoJsonFeature) => void;
  editable?: boolean;
}

const MapComponentAktivitaet: React.FC<MapComponentProps> = ({
  address,
  position,
  radius,
  zoom,
  MapClickHandler,
  drawShape,
  geoJsonData,
  onShapeChange,
  editable,
}) => {
  const drawnItemsRef = useRef<L.FeatureGroup>(null);
  const [shapeDrawn, setShapeDrawn] = useState(false);

  useEffect(() => {
    if (geoJsonData != null) {
      setShapeDrawn(true);
    }
  }, [geoJsonData]);

  const onCreated = (e: any) => {
    const layer = e.layer;
    const geoJson: Feature<Geometry, any> = layer.toGeoJSON();

    if (e.layerType === "circle" && layer.getRadius) {
      geoJson.properties = {
        ...geoJson.properties,
        radius: layer.getRadius(),
      };
    }

    setShapeDrawn(true);
    console.log("Shape created:", geoJson);
    if (onShapeChange) onShapeChange(geoJson);

    if (layer.bindPopup) {
      layer.bindPopup("<b>Hallo!</b><br>Dies ist ein Popup.").openPopup();
    }
  };

  const onEdited = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      const geoJson: Feature<Geometry, any> = layer.toGeoJSON();
      console.log("Shape edited:", geoJson);
      if (onShapeChange) onShapeChange(geoJson);
    });
  };

  const onDeleted = (e: any) => {
    e.layers.eachLayer((layer: any) => {
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
        {drawShape && (
          <FeatureGroup ref={drawnItemsRef}>
            {geoJsonData && editable && (
              <GeoJSON
                key={JSON.stringify(geoJsonData)}
                data={geoJsonData as any}
                style={{ color: "red" }}
                pointToLayer={(feature, latlng) => {
                  if (feature.properties?.radius) {
                    return L.circle(latlng, {
                      radius: feature.properties.radius,
                    });
                  }
                  return L.marker(latlng, { icon: customIcon });
                }}
              />
            )}
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
        )}
        {geoJsonData && !editable && (
          <>
            <GeoJSON
              key={JSON.stringify(geoJsonData)}
              data={geoJsonData}
              style={{ color: "red" }}
              pointToLayer={(feature, latlng) => {
                if (feature.properties?.radius) {
                  return L.circle(latlng, {
                    radius: feature.properties.radius,
                    color: "red",
                  });
                }
                return L.marker(latlng, { icon: customIcon });
              }}
            />
            <FitBoundsOnShape geoJson={geoJsonData} />
          </>
        )}
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

export default MapComponentAktivitaet;
