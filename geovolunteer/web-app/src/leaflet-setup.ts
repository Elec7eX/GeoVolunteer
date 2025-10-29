/* eslint-disable import/first */
// leaflet-setup.ts
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Damit UMD-Module L finden (global)
;(window as any).L = L;

// Optional: CSS für routing-machine (falls du Single CSS import willst)
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Jetzt das UMD-Modul synchron importieren — weil window.L schon gesetzt ist
// Bei CRA/Webpack funktioniert das, weil diese Datei vor App geladen wird.
import "leaflet-routing-machine";

// exportiere L für Fälle, wo du es explizit importieren willst
export default L;
