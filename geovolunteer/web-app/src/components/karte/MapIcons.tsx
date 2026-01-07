import { Icon } from "leaflet";

export const orgIcon = new Icon({
  iconUrl: require("../../icons/building.png"),
  iconSize: [45, 45],
});

export const markerIcon = new Icon({
  iconUrl: require("../../icons/box.png"),
  iconSize: [38, 38],
});

export const aktivitaetIcon = new Icon({
  iconUrl: require("../../icons/heart-rate_1.png"),
  iconSize: [40, 40],
});

export const meineFreiwilligeIcon = new Icon({
  iconUrl: require("../../icons/user.png"),
  iconSize: [30, 30],
});

export const alleFreiwilligeIcon = new Icon({
  iconUrl: require("../../icons/user_add.png"),
  iconSize: [30, 30],
});
