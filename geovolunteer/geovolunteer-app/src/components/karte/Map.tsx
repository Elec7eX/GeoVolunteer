import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon, Icon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

type MarkerType = {
  geocode: [number, number];
  popUp: string;
};

export default function Map() {
  const markers: MarkerType[] = [
    {
      geocode: [48.30888, 14.28888],
      popUp: "Hi, this is marker 1",
    },
    {
      geocode: [48.30555, 14.28444],
      popUp: "Hi, this is marker 2",
    },
    {
      geocode: [48.30222, 14.28555],
      popUp: "Hi, this is marker 3",
    },
  ];

  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  const createCustomClusterIcon = (cluster: any) => {
    return divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "cluster-icon",
      iconSize: point(33, 33, true),
    });
  };

  return (
    <>
      <Header title={t("map.overview.title")} />
      <div className="body">
        <MapContainer
          center={[48.30639, 14.28611]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "765px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createCustomClusterIcon}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.geocode} icon={customIcon}>
                <Popup>{marker.popUp}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}
