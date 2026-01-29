import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  ZoomControl,
  GeoJSON,
} from "react-leaflet";
import L, { Icon } from "leaflet";
import { Form } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { GeoJsonFeature } from "../../types/Types";
import FitBoundsOnShape from "./FitBoundsOnShapeProps";

interface MapComponentProps {
  position?: [number, number] | null;
  zoom?: number | null;
  geoJsonData?: GeoJsonFeature;
}

const customIcon = new Icon({
  iconUrl: require("../../icons/marker-icon.png"),
  iconSize: [38, 38],
});

const MapComponent: React.FC<MapComponentProps> = ({
  position,
  zoom,
  geoJsonData,
}) => {
  const drawnItemsRef = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (!geoJsonData) return;

    const timeout = setTimeout(() => {
      if (!drawnItemsRef.current) return;

      // GeoJSON Layer erzeugen
      const layer = L.geoJSON(geoJsonData as any, {
        pointToLayer: (feature, latlng) => {
          if (feature.properties?.radius) {
            return L.circle(latlng, {
              radius: feature.properties.radius,
              color: "red",
            });
          }
          return L.marker(latlng, { icon: customIcon, draggable: true });
        },
      });

      layer.eachLayer((l) => drawnItemsRef.current?.addLayer(l));
    }, 0);

    return () => clearTimeout(timeout);
  }, [geoJsonData]);

  return (
    <>
      {geoJsonData?.properties?.data?.address && (
        <Form.Group className="mb-3">
          <Form.Text>
            <div>
              Address:{" "}
              {geoJsonData.properties.data.address.road +
              " " +
              (geoJsonData.properties.data.address.house_number
                ? geoJsonData.properties.data.address.house_number
                : "") +
              ", " +
              geoJsonData.properties.data.address.postcode +
              " " +
              geoJsonData.properties.data.address.city
                ? geoJsonData.properties.data.address.city
                : geoJsonData.properties.data.address.town}
            </div>
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
          {geoJsonData && (
            <>
              <GeoJSON
                data={geoJsonData as any}
                style={{ color: "blue" }}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, { icon: customIcon });
                }}
                ref={(layer: any) => {
                  if (layer && drawnItemsRef.current) {
                    layer.eachLayer((l: any) => {
                      drawnItemsRef.current?.addLayer(l);
                    });
                  }
                }}
              />
            </>
          )}
          {geoJsonData && <FitBoundsOnShape geoJsonData={geoJsonData} />}
        </FeatureGroup>
      </MapContainer>
    </>
  );
};

export default MapComponent;
