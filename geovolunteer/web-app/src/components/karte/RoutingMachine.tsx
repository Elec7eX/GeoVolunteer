import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

export function RoutingMachine({ waypoints }: { waypoints: L.LatLng[] }) {
  const map = useMap();
  const controlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!controlRef.current) {
      controlRef.current = (L.Routing.control as any)({
        waypoints: [],
        lineOptions: {
          styles: [{ color: "#007bff", weight: 5, opacity: 0.7 }],
        },
        routeWhileDragging: true,
        addWaypoints: false,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
      }).addTo(map);
    }

    if (waypoints.length >= 2) {
      controlRef.current!.setWaypoints(waypoints);
    } else {
      controlRef.current!.setWaypoints([]);
    }

    return () => {
      // nichts tun — wir behalten das Control im Speicher
    };
  }, [map, waypoints]);

  return null;
}
