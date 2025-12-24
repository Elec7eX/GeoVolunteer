import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  FeatureGroup,
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
  zoom?: number | null;
  geoJsonData?: GeoJsonFeature;
  onShapeChange?: (geoJson: GeoJsonFeature | null) => void;
  editable?: boolean;
  drawMarkerOnly?: boolean;
  markerWithRadiusMode?: boolean;
  radius?: number;
}

const customIcon = new Icon({
  iconUrl: require("../../icons/marker-icon.png"),
  iconSize: [38, 38],
});

const MapComponent: React.FC<MapComponentProps> = ({
  position,
  zoom,
  geoJsonData,
  onShapeChange,
  editable,
  drawMarkerOnly,
  markerWithRadiusMode,
  radius,
}) => {
  const drawnItemsRef = useRef<L.FeatureGroup>(null);
  const [shapeDrawn, setShapeDrawn] = useState(false);
  const [effectiveRadius, setEffectiveRadius] = useState<number>(0);

  useEffect(() => {
    if (!geoJsonData || !editable) return;

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
          return L.marker(latlng, { icon: customIcon });
        },
      });

      layer.eachLayer((l) => drawnItemsRef.current?.addLayer(l));
      if (geoJsonData && geoJsonData.type === "Feature") {
        setEffectiveRadius(radius ?? geoJsonData.properties?.radius ?? 0);
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [geoJsonData, editable, radius]);

  const onCreated = useCallback(
    async (e: any) => {
      const layer = e.layer;
      const geoJson: Feature<Geometry, any> = layer.toGeoJSON();

      if (e.layerType === "circle" && layer.getRadius) {
        geoJson.properties = {
          ...geoJson.properties,
          radius: layer.getRadius(),
        };
      }

      if (drawnItemsRef.current) {
        drawnItemsRef.current.addLayer(layer);
      }

      setShapeDrawn(true);
      console.log("Shape created:", geoJson);

      if (e.layerType === "marker") {
        const latlng = layer.getLatLng();
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json&addressdetails=1`
          );
          const data = await response.json();
          geoJson.properties = { ...geoJson.properties, data };
          onShapeChange?.({
            ...geoJson,
            properties: { ...geoJson.properties, data },
          });
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
          onShapeChange?.(geoJson);
        }
      } else {
        onShapeChange?.(geoJson);
      }
    },
    [onShapeChange]
  );

  const onEdited = useCallback(
    async (e: any) => {
      e.layers.eachLayer(async (layer: any) => {
        const geoJson: Feature<Geometry, any> = layer.toGeoJSON();

        if (layer instanceof L.Circle) {
          geoJson.properties = {
            ...geoJson.properties,
            radius: layer.getRadius(),
          };
          onShapeChange?.(geoJson);
          return;
        }

        if (layer instanceof L.Marker) {
          const latlng = layer.getLatLng();
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json&addressdetails=1`
            );
            const data = await response.json();
            geoJson.properties = { ...geoJson.properties, data };
            onShapeChange?.({
              ...geoJson,
              properties: { ...geoJson.properties, data },
            });
          } catch (err) {
            console.error("Reverse geocoding failed on edit:", err);
            onShapeChange?.(geoJson);
          }
        } else {
          onShapeChange?.(geoJson);
        }

        console.log("Shape edited:", geoJson);
      });
    },
    [onShapeChange]
  );

  const onDeleted = (e: any) => {
    e.layers.eachLayer(() => {
      setShapeDrawn(false);
      console.log("Shape deleted");
      onShapeChange?.(null);
    });
  };

  const drawOptions = useMemo(() => {
    if (drawMarkerOnly || markerWithRadiusMode) {
      return {
        rectangle: false,
        polygon: false,
        circle: false,
        marker: !shapeDrawn ? { icon: customIcon } : false,
        circlemarker: false,
        polyline: false,
      };
    }
    return {
      rectangle: !shapeDrawn,
      polygon: !shapeDrawn,
      circle: !shapeDrawn,
      marker: !shapeDrawn ? { icon: customIcon } : false,
      circlemarker: false,
      polyline: false,
    };
  }, [shapeDrawn, drawMarkerOnly, markerWithRadiusMode]);

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
                geoJsonData.properties.data.address.city}
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
          {editable && (
            <EditControl
              position="topleft"
              onCreated={onCreated}
              onEdited={onEdited}
              onDeleted={onDeleted}
              edit={{
                moveMarkers: true,
              }}
              draw={drawOptions}
            />
          )}
          {geoJsonData && (
            <>
              <GeoJSON
                data={geoJsonData as any}
                style={{ color: "red" }}
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
              {markerWithRadiusMode &&
                geoJsonData &&
                geoJsonData.type === "Feature" &&
                geoJsonData.geometry.type === "Point" && (
                  <Circle
                    key={`radius-${effectiveRadius}`} // zwingt Leaflet zum Neurendern bei Radiusänderung
                    center={[
                      (geoJsonData.geometry.coordinates as number[])[1],
                      (geoJsonData.geometry.coordinates as number[])[0],
                    ]}
                    radius={radius || 0}
                    pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                  />
                )}
            </>
          )}
          {geoJsonData && !editable && (
            <FitBoundsOnShape geoJson={geoJsonData} />
          )}
        </FeatureGroup>
      </MapContainer>
    </>
  );
};

export default MapComponent;
