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
import {
  ButtonGroup,
  DropdownButton,
  DropdownDivider,
  Form,
} from "react-bootstrap";
import { FaFilter } from "react-icons/fa";

interface FilterType {
  meineOrganisation: boolean;
  meineAktivitaeten: boolean;
  meineFreiwilligen: boolean;
  alleOrganisationen: boolean;
  alleAktivitaeten: boolean;
  alleFreiwilligen: boolean;
}

type MarkerType = {
  geocode: [number, number];
  popUp: string;
};

export default function Map() {
  const [user] = useLocalStorage("user", null);
  const initialized = useRef(false);

  const [filter, setFilter] = useState<FilterType>({
    meineOrganisation: true,
    meineAktivitaeten: true,
    meineFreiwilligen: true,
    alleOrganisationen: false,
    alleAktivitaeten: false,
    alleFreiwilligen: false,
  });

  const [meineOrganistaion, setMeineOrganisation] = useState<MarkerType>();
  const [meineAktivitaeten, setMeineAktivitaeten] = useState<MarkerType[]>([]);
  const [meineFreiwilligen, setMeineFreiwilligen] = useState<MarkerType[]>([]);

  useEffect(() => {
    if (!initialized.current) {
      if (UserType.ORGANISATION === user.rolle) {
        initialized.current = true;
        userService
          .get(user.id)
          .then((resp) => {
            var org = resp.data;
            if (resp.status === 200) {
              setMeineOrganisation({
                geocode: [org.latitude!, org.longitude!],
                popUp: org.name!,
              });
              aktivitaetService
                .getErstellteAktivitaeten()
                .then((res) => {
                  if (res.status === 200) {
                    const markerArray: MarkerType[] = res.data.map(
                      (aktivitaet: AktivitaetModel) => ({
                        geocode: [aktivitaet.latitude, aktivitaet.longitude],
                        popUp: aktivitaet.name,
                      })
                    );
                    setMeineAktivitaeten(markerArray);
                  } else {
                    console.log(
                      "'Meine Aktivitäten konnte nicht geladen werden: Status - " +
                        res.status
                    );
                  }
                })
                .catch((error) => {
                  console.log(error);
                  alert("'Meine Aktivitäten' konnte nicht geladen werden!");
                });
            } else {
              console.log(
                "'Meine Organisation konnte nicht geladen werden: Status - " +
                  resp.status
              );
            }
          })
          .catch((error) => {
            console.log(error);
            alert("'Meine Organisation' konnte nicht geladen werden!");
          });
      }
    }
  }, [user.id, user.rolle]);

  const updateFilter = (filterName: keyof FilterType) => {
    setFilter((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  const aktivitaetIcon = new Icon({
    iconUrl: require("../../icons/aktivitaet-icon.png"),
    iconSize: [44, 44],
  });

  const MapDropdown = ({
    filter,
    toggleFilter,
  }: {
    filter: FilterType;
    toggleFilter: (filterName: keyof FilterType) => void;
  }) => {
    const [submenuOpen, setSubmenuOpen] = useState(false);

    return (
      <DropdownButton
        as={ButtonGroup}
        drop="end"
        variant="light"
        title={<FaFilter color="black" />}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: "5px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ padding: "10px", minWidth: "200px" }}>
          <div style={{ marginBottom: "10px" }}>
            <h6
              style={{
                marginBottom: "5px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {t("map.filter.organisation.eigene.title")}
            </h6>
            <Form.Check
              type="checkbox"
              id="meineOrganisation"
              label={t("map.filter.organisation.eigene")}
              checked={filter.meineOrganisation}
              onChange={() => toggleFilter("meineOrganisation")}
              onClick={(e) => e.stopPropagation()}
              style={{ marginBottom: "5px" }}
            />
            <Form.Check
              type="checkbox"
              id="meineAktivitaeten"
              label={t("map.filter.organisation.eigene.aktivitaeten")}
              checked={filter.meineAktivitaeten}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleFilter("meineAktivitaeten")}
            />
            <Form.Check
              type="checkbox"
              id="meineFreiwilligen"
              label={t("map.filter.organisation.eigene.freiwilligen")}
              checked={filter.meineFreiwilligen}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleFilter("meineFreiwilligen")}
            />
            {/* Untermenü */}
            <div style={{ position: "relative" }}>
              <div
                className="dropdown-item"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "6px 12px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSubmenuOpen((prev) => !prev);
                }}
              >
                <div className="submenu-toggle">Weitere Filter →</div>
                {submenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "100%",
                      marginLeft: "5px",
                      backgroundColor: "#fff",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderRadius: "5px",
                      padding: "10px",
                      minWidth: "180px",
                      zIndex: 2000,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Form.Check
                      type="checkbox"
                      id="extraFilter1"
                      onClick={(e) => e.stopPropagation()}
                      label="Extra Filter 1"
                      style={{ marginBottom: "5px" }}
                    />
                    <Form.Check
                      type="checkbox"
                      id="extraFilter2"
                      onClick={(e) => e.stopPropagation()}
                      label="Extra Filter 2"
                    />
                  </div>
                )}
              </div>
            </div>
            <DropdownDivider />
            <div>
              <h6
                style={{
                  marginBottom: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {t("map.filter.organisation.alle.title")}
              </h6>
              <Form.Check
                type="checkbox"
                id="alleFreiwilligen"
                label={t("map.filter.organisation.alle.freiwillige")}
                checked={filter.alleFreiwilligen}
                onChange={() => toggleFilter("alleFreiwilligen")}
                onClick={(e) => e.stopPropagation()}
                style={{ marginBottom: "5px" }}
              />
              <Form.Check
                type="checkbox"
                id="alleOrganisationen"
                label={t("map.filter.organisation.alle.organisationen")}
                checked={filter.alleOrganisationen}
                onChange={() => toggleFilter("alleOrganisationen")}
                onClick={(e) => e.stopPropagation()}
                style={{ marginBottom: "5px" }}
              />
              <Form.Check
                type="checkbox"
                id="alleAktivitaeten"
                label={t("map.filter.organisation.alle.aktivitaeten")}
                checked={filter.alleAktivitaeten}
                onChange={() => toggleFilter("alleAktivitaeten")}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </DropdownButton>
    );
  };

  return (
    <>
      <Header title={t("map.overview.title")} />
      <div className="body">
        <MapContainer
          center={[48.30639, 14.28611]}
          zoom={13}
          scrollWheelZoom={true}
          zoomControl={false}
          doubleClickZoom={false}
          style={{ height: "739px", width: "100%" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomControl position="topright" />
          {UserType.ORGANISATION === user.rolle && (
            <>
              {filter.meineOrganisation && meineOrganistaion !== undefined && (
                <Marker
                  key={user.id}
                  position={meineOrganistaion.geocode}
                  icon={customIcon}
                >
                  <Popup>{meineOrganistaion.popUp}</Popup>
                </Marker>
              )}
              {filter.meineAktivitaeten &&
                meineAktivitaeten.map((marker, index) => (
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
          <MapDropdown filter={filter} toggleFilter={updateFilter} />
          {/*<DropdownButton
            as={ButtonGroup}
            drop="end"
            variant="light"
            title={<FaFilter color="black" />}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1000,
              border: "2px solid rgba(0,0,0,0.2)",
              borderRadius: "5px",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ padding: "10px", minWidth: "200px" }}>
              <div style={{ marginBottom: "10px" }}>
                <h6
                  style={{
                    marginBottom: "5px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("map.filter.organisation.eigene.title")}
                </h6>
                <Form.Check
                  type="checkbox"
                  id="meineOrganisation"
                  label={t("map.filter.organisation.eigene")}
                  checked={filter.meineOrganisation}
                  onChange={() => updateFilter("meineOrganisation")}
                  style={{ marginBottom: "5px" }}
                />
                <Form.Check
                  type="checkbox"
                  id="meineAktivitaeten"
                  label={t("map.filter.organisation.eigene.aktivitaeten")}
                  checked={filter.meineAktivitaeten}
                  onChange={() => updateFilter("meineAktivitaeten")}
                />
                <Form.Check
                  type="checkbox"
                  id="meineFreiwilligen"
                  label={t("map.filter.organisation.eigene.freiwilligen")}
                  checked={filter.meineFreiwilligen}
                  onChange={() => updateFilter("meineFreiwilligen")}
                />
              </div>
              <DropdownDivider />
              <div>
                <h6
                  style={{
                    marginBottom: "5px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {t("map.filter.organisation.alle.title")}
                </h6>
                <Form.Check
                  type="checkbox"
                  id="alleFreiwilligen"
                  label={t("map.filter.organisation.alle.freiwillige")}
                  checked={filter.alleFreiwilligen}
                  onChange={() => updateFilter("alleFreiwilligen")}
                  style={{ marginBottom: "5px" }}
                />
                <Form.Check
                  type="checkbox"
                  id="alleOrganisationen"
                  label={t("map.filter.organisation.alle.organisationen")}
                  checked={filter.alleOrganisationen}
                  onChange={() => updateFilter("alleOrganisationen")}
                  style={{ marginBottom: "5px" }}
                />
                <Form.Check
                  type="checkbox"
                  id="alleAktivitaeten"
                  label={t("map.filter.organisation.alle.aktivitaeten")}
                  checked={filter.alleAktivitaeten}
                  onChange={() => updateFilter("alleAktivitaeten")}
                />
              </div>
            </div>
          </DropdownButton>*/}
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}
