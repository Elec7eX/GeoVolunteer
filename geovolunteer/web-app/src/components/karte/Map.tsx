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
import { AktivitaetModel, UserModel } from "../../types/Types";
import {
  ButtonGroup,
  Dropdown,
  DropdownButton,
  DropdownDivider,
  Form,
} from "react-bootstrap";
import { FaFilter } from "react-icons/fa";

interface FilterType {
  showSubmenu: boolean;
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
    showSubmenu: false,
    meineOrganisation: true,
    meineAktivitaeten: true,
    meineFreiwilligen: false,
    alleOrganisationen: false,
    alleAktivitaeten: false,
    alleFreiwilligen: false,
  });

  const [meineOrganistaion, setMeineOrganisation] = useState<MarkerType>();
  const [meineAktivitaeten, setMeineAktivitaeten] = useState<MarkerType[]>([]);
  const [meineFreiwilligen, setMeineFreiwilligen] = useState<MarkerType[]>([]);

  const [alleOrganistaionen, setAlleOrganisationen] = useState<MarkerType[]>(
    []
  );
  const [alleAktivitaeten, setAlleAktivitaeten] = useState<MarkerType[]>([]);
  const [alleFreiwilligen, setAlleFreiwilligen] = useState<MarkerType[]>([]);

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

                    const teilnehmerData: UserModel[] = res.data.flatMap(
                      (aktivitaet: AktivitaetModel) => aktivitaet.teilnehmer!
                    );
                    if (teilnehmerData.length > 0) {
                      const teilnehmer: MarkerType[] = teilnehmerData.map(
                        (t: UserModel) => ({
                          geocode: [t.latitude!, t.longitude!],
                          popUp: t.vorname! + " " + t.nachname!,
                        })
                      );
                      setMeineFreiwilligen(teilnehmer);
                    }
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
    if (filterName === "alleOrganisationen" && alleOrganistaionen.length < 1) {
      userService.getOrganisationen().then((resp) => {
        if (resp.status === 200) {
          const markerArray: MarkerType[] = resp.data.map((org: UserModel) => ({
            geocode: [org.latitude!, org.longitude!],
            popUp: org.name!,
          }));
          setAlleOrganisationen(markerArray);
        }
      });
    }
    if (filterName === "alleAktivitaeten" && alleAktivitaeten.length < 1) {
      aktivitaetService.getAll().then((resp) => {
        if (resp.status === 200) {
          const markerArray: MarkerType[] = resp.data.map(
            (aktivitaet: AktivitaetModel) => ({
              geocode: [aktivitaet.latitude, aktivitaet.longitude],
              popUp: aktivitaet.name,
            })
          );
          setAlleAktivitaeten(markerArray);
        }
      });
    }
    if (filterName === "alleFreiwilligen" && alleFreiwilligen.length < 1) {
      userService.getFreiwillige().then((resp) => {
        if (resp.status === 200) {
          const markerArray: MarkerType[] = resp.data.map(
            (freiwillige: UserModel) => ({
              geocode: [freiwillige.latitude!, freiwillige.longitude!],
              popUp: freiwillige.vorname! + " " + freiwillige.nachname,
            })
          );
          setAlleFreiwilligen(markerArray);
        }
      });
    }
    setFilter((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const updateSubmenu = (filterName: keyof FilterType) => {
    setFilter((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const customIcon = new Icon({
    iconUrl: require("../../icons/organisation.png"),
    iconSize: [100, 100],
  });

  const aktivitaetIcon = new Icon({
    iconUrl: require("../../icons/aktivitaet.png"),
    iconSize: [100, 100],
  });

  const freiwilligeIcon = new Icon({
    iconUrl: require("../../icons/freiwillige.png"),
    iconSize: [100, 100],
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
              {filter.meineFreiwilligen &&
                meineFreiwilligen.map((marker, index) => (
                  <Marker
                    key={index}
                    position={marker.geocode}
                    icon={freiwilligeIcon}
                  >
                    <Popup>{marker.popUp}</Popup>
                  </Marker>
                ))}
              {filter.alleOrganisationen &&
                alleOrganistaionen.map((marker, index) => (
                  <Marker
                    key={index}
                    position={marker.geocode}
                    icon={customIcon}
                  >
                    <Popup>{marker.popUp}</Popup>
                  </Marker>
                ))}
              {filter.alleAktivitaeten &&
                alleAktivitaeten.map((marker, index) => (
                  <Marker
                    key={index}
                    position={marker.geocode}
                    icon={aktivitaetIcon}
                  >
                    <Popup>{marker.popUp}</Popup>
                  </Marker>
                ))}
              {filter.alleFreiwilligen &&
                alleFreiwilligen.map((marker, index) => (
                  <Marker
                    key={index}
                    position={marker.geocode}
                    icon={freiwilligeIcon}
                  >
                    <Popup>{marker.popUp}</Popup>
                  </Marker>
                ))}
            </>
          )}
          <DropdownButton
            className="map-dropdown"
            as={ButtonGroup}
            drop="end"
            variant="light"
            title={<FaFilter color="black" />}
          >
            <div style={{ padding: "10px", minWidth: "200px" }}>
              <div style={{ marginBottom: "10px" }}>
                <h6 className="map-dropdown_title">
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
                <Dropdown.Item
                  as="div"
                  className="map-dropdown_item"
                  onMouseEnter={() => updateSubmenu("showSubmenu")}
                  onMouseLeave={() => updateSubmenu("showSubmenu")}
                >
                  <div style={{ paddingLeft: "8px" }}>
                    {t("map.filter.organisation.submenu.arrow")}
                  </div>
                  {filter.showSubmenu && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="submenu"
                    >
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
                  )}
                </Dropdown.Item>
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
                <Form.Check
                  type="checkbox"
                  id="alleFreiwilligen"
                  label={t("map.filter.organisation.alle.freiwillige")}
                  checked={filter.alleFreiwilligen}
                  onChange={() => updateFilter("alleFreiwilligen")}
                  style={{ marginBottom: "5px" }}
                />
              </div>
            </div>
          </DropdownButton>
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}
