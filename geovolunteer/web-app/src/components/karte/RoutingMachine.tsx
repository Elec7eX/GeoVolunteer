import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export function RoutingMachine({ waypoints }: { waypoints: L.LatLng[] }) {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    // Entfernen, wenn weniger als 2 Punkte
    if (waypoints.length < 2) {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
      return;
    }

    // Control erstellen, falls noch nicht vorhanden
    if (!controlRef.current) {
      controlRef.current = (L.Routing.control as any)({
        waypoints: [],
        lineOptions: {
          styles: [{ color: "#007bff", weight: 5, opacity: 0.7 }],
        },
        language: "de",
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
      }).addTo(map);
    }

    // Waypoints mit kleiner Verzögerung setzen
    setTimeout(() => {
      controlRef.current?.setWaypoints(waypoints);
    }, 50); // 50ms Verzögerung reicht meistens

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, waypoints]);

  return null;
}
