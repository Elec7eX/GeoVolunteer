import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useEffect, useRef, useState } from "react";
import { UserType } from "../../enums/Enums";
import userService from "../../services/UserServices";
import aktivitaetService from "../../services/AktivitaetService";
import { AktivitaetModel } from "../../types/Types";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";

type MarkerType = {
  geocode: [number, number];
  popUp: string;
};

export default function Map() {
  const [user] = useLocalStorage("user", null);
  const initialized = useRef(false);

  const [organistaion, setOrganisation] = useState<MarkerType>();
  const [erstellteAktivitaeten, setErstellteAktivitaeten] = useState<
    MarkerType[]
  >([]);

  useEffect(() => {
    if (!initialized.current) {
      if (UserType.ORGANISATION === user.rolle) {
        initialized.current = true;
        userService.get(user.id).then((resp) => {
          var org = resp.data;
          setOrganisation({
            geocode: [org.latitude!, org.longitude!],
            popUp: org.name!,
          });
          aktivitaetService.getErstellteAktivitaeten().then((res) => {
            const markerArray: MarkerType[] = res.data.map(
              (aktivitaet: AktivitaetModel) => ({
                geocode: [aktivitaet.latitude, aktivitaet.longitude],
                popUp: aktivitaet.name,
              })
            );
            setErstellteAktivitaeten(markerArray);
          });
        });
      }
    }
  }, [user.id, user.rolle]);

  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  const aktivitaetIcon = new Icon({
    iconUrl: require("../../icons/aktivitaet-icon.png"),
    iconSize: [45, 45],
  });

  return (
    <>
      <Header title={t("map.overview.title")} />
      <div className="body">
        <MapContainer
          center={[48.30639, 14.28611]}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: "739px", width: "100%" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomControl position="topright" />
          {UserType.ORGANISATION === user.rolle && (
            <>
              {organistaion !== undefined && (
                <Marker
                  key={user.id}
                  position={organistaion.geocode}
                  icon={customIcon}
                >
                  <Popup>{organistaion.popUp}</Popup>
                </Marker>
              )}
              {erstellteAktivitaeten.map((marker, index) => (
                <Marker
                  key={index}
                  position={marker.geocode}
                  icon={aktivitaetIcon}
                >
                  <Popup>{marker.popUp}</Popup>
                </Marker>
              ))}
            </>
          )}
          <DropdownButton
            as={ButtonGroup}
            drop={"end"}
            variant="light"
            title={<FaFilter color="black" />}
            style={{
              position: "absolute",
              top: "10px", // Positionierung des Buttons unterhalb der Zoom-Steuerung
              left: "10px",
              zIndex: 1000,
              border: "2px solid rgba(0,0,0,0.2)",
              borderRadius: "5px",
              backgroundColor: "#fff",
            }}
          >
            <Dropdown.Item eventKey="1">Action</Dropdown.Item>
            <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
            <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
          </DropdownButton>
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}
