import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useEffect, useRef, useState } from "react";
import { UserType } from "../../enums/Enums";
import userService from "../../services/UserServices";
import aktivitaetService from "../../services/AktivitaetService";
import { AktivitaetModel, UserModel } from "../../types/Types";
import { Button, DropdownDivider, Form, Offcanvas } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import type { Feature, Geometry } from "geojson";
import { RoutingMachine } from "../karte/RoutingMachine";

interface FilterType {
  showSubmenu: boolean;
  meineOrganisation: boolean;
  meineAktivitaeten: boolean;
  meineFreiwilligen: boolean;
  alleOrganisationen: boolean;
  alleAktivitaeten: boolean;
  alleFreiwilligen: boolean;
}

interface AktivitaetFilterType {
  visible: boolean;
  expanded: boolean;
  ressource: boolean;
  teilnehmer: { [id: string]: boolean };
}

type GeoJsonFeature = Feature<Geometry, { [key: string]: any }> | null;

export default function Map() {
  const [user] = useLocalStorage("user", null);
  const initialized = useRef(false);
  const drawnItemsRef = useRef(null);

  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  const [filter, setFilter] = useState<FilterType>({
    showSubmenu: false,
    meineOrganisation: true,
    meineAktivitaeten: true,
    meineFreiwilligen: false,
    alleOrganisationen: false,
    alleAktivitaeten: false,
    alleFreiwilligen: false,
  });
  const [aktivitaetenFilter, setAktivitaetenFilter] = useState<{
    [id: string]: AktivitaetFilterType;
  }>({});

  const [meineOrganistaion, setMeineOrganisation] = useState<UserModel>();
  const [meineAktivitaeten, setMeineAktivitaeten] = useState<AktivitaetModel[]>(
    []
  );
  const [meineFreiwilligen, setMeineFreiwilligen] = useState<UserModel[]>([]);

  const [alleOrganistaionen, setAlleOrganisationen] = useState<
    GeoJsonFeature[]
  >([]);
  const [alleAktivitaeten, setAlleAktivitaeten] = useState<GeoJsonFeature[]>(
    []
  );
  const [alleFreiwilligen, setAlleFreiwilligen] = useState<GeoJsonFeature[]>(
    []
  );

  const [selectedPoints, setSelectedPoints] = useState<L.LatLng[]>([]);

  const allOptions: { label: string; feature: GeoJsonFeature }[] = [
    ...(meineOrganistaion?.shape
      ? [
          {
            label: meineOrganistaion.name ?? "Organisation",
            feature: meineOrganistaion.shape,
          },
        ]
      : []),
    ...meineAktivitaeten
      .filter((a) => a.shape)
      .map((a) => ({ label: a.name ?? "Aktivität", feature: a.shape! })),
    ...meineFreiwilligen
      .filter((f) => f.shape)
      .map((f) => ({ label: f.vorname + " " + f.nachname, feature: f.shape! })),
  ];
  useEffect(() => {
    if (!initialized.current) {
      if (UserType.ORGANISATION === user.rolle) {
        initialized.current = true;
        userService
          .get(user.id)
          .then((resp) => {
            var org = resp.data;
            if (resp.status === 200) {
              setMeineOrganisation(org as UserModel);
              aktivitaetService
                .getErstellteAktivitaeten()
                .then((res) => {
                  if (res.status === 200) {
                    const aktivitaetenArray: AktivitaetModel[] = res.data.map(
                      (aktivitaet: AktivitaetModel) => aktivitaet
                    );
                    setMeineAktivitaeten(aktivitaetenArray);

                    const aktivitaetenMap: {
                      [id: string]: AktivitaetFilterType;
                    } = {};

                    res.data.forEach((aktivitaet: AktivitaetModel) => {
                      const teilnehmerMap: { [id: string]: boolean } = {};

                      aktivitaet.teilnehmer?.forEach((t: UserModel) => {
                        teilnehmerMap[t.id!] = true;
                      });

                      aktivitaetenMap[aktivitaet.id!] = {
                        visible: true,
                        expanded: false,
                        ressource: true,
                        teilnehmer: teilnehmerMap,
                      };
                    });
                    setAktivitaetenFilter(aktivitaetenMap);

                    const teilnehmerData: UserModel[] = res.data.flatMap(
                      (aktivitaet: AktivitaetModel) => aktivitaet.teilnehmer!
                    );
                    if (teilnehmerData.length > 0) {
                      const teilnehmer: UserModel[] = teilnehmerData.map(
                        (t: UserModel) => t
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
    const el = document.querySelector(".app");
    if (el instanceof HTMLElement) {
      setContainer(el);
    }
  }, [user.id, user.rolle]);

  const updateFilter = (filterName: keyof FilterType) => {
    if (filterName === "alleOrganisationen" && alleOrganistaionen.length < 1) {
      userService.getOrganisationen().then((resp) => {
        if (resp.status === 200) {
          const organisationenShapes: GeoJsonFeature[] = resp.data.map(
            (org: UserModel) => org.shape!
          );
          setAlleOrganisationen(organisationenShapes);
        }
      });
    }
    if (filterName === "alleAktivitaeten" && alleAktivitaeten.length < 1) {
      aktivitaetService.getAll().then((resp) => {
        if (resp.status === 200) {
          const aktivitaetenShapes: GeoJsonFeature[] = resp.data.map(
            (aktivitaet: AktivitaetModel) => aktivitaet.shape
          );
          setAlleAktivitaeten(aktivitaetenShapes);
        }
      });
    }
    if (filterName === "alleFreiwilligen" && alleFreiwilligen.length < 1) {
      userService.getFreiwillige().then((resp) => {
        if (resp.status === 200) {
          const freiwilligenShapes: GeoJsonFeature[] = resp.data.map(
            (freiwillige: UserModel) => freiwillige.shape!
          );
          setAlleFreiwilligen(freiwilligenShapes);
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

  const orgIcon = new Icon({
    iconUrl: require("../../icons/organisation.png"),
    iconSize: [100, 100],
  });

  const markerIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  const aktivitaetIcon = new Icon({
    iconUrl: require("../../icons/aktivitaet.png"),
    iconSize: [100, 100],
  });

  const freiwilligeIcon = new Icon({
    iconUrl: require("../../icons/freiwillige.png"),
    iconSize: [100, 100],
  });

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

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
          <FeatureGroup ref={drawnItemsRef}>
            {UserType.ORGANISATION === user.rolle && (
              <>
                {filter.meineOrganisation && meineOrganistaion && (
                  <GeoJSON
                    key={"meineOrganisation"}
                    data={meineOrganistaion.shape!}
                    pointToLayer={(feature, latlng) => {
                      return L.marker(latlng, { icon: orgIcon });
                    }}
                    onEachFeature={(f, layer) => {
                      layer.bindPopup(
                        meineOrganistaion?.name ?? "Organisation"
                      );
                      layer.bindTooltip(f.properties?.name || "Marker", {
                        permanent: false,
                        direction: "top",
                      });
                    }}
                  />
                )}
                {filter.meineAktivitaeten &&
                  meineAktivitaeten.map((feature, index) => {
                    const id = feature.id ?? index;
                    const aFilter = aktivitaetenFilter[id];
                    if (!aFilter?.visible) return null;

                    // Aktivität selbst
                    const layer = (
                      <GeoJSON
                        key={`aktivitaet-${id}`}
                        data={feature.shape!}
                        pointToLayer={(f, latlng) =>
                          L.marker(latlng, { icon: aktivitaetIcon })
                        }
                        onEachFeature={(f, layer) => {
                          layer.bindPopup(feature.name ?? "Aktivität");
                          layer.bindTooltip(f.properties?.name || "Marker", {
                            permanent: false,
                            direction: "top",
                          });
                          layer.on("click", (e) => {
                            const latlng = e.latlng;
                            setSelectedPoints((prev) => {
                              const newPoints = [...prev, latlng];
                              // Nach zwei Punkten Route starten
                              if (newPoints.length > 2) newPoints.shift(); // Nur 2 behalten
                              return newPoints;
                            });
                          });
                        }}
                      />
                    );

                    // Ressource (einzeln)
                    const ressourceLayer =
                      aFilter.ressource && feature?.ressource?.shape ? (
                        <GeoJSON
                          key={`ressource-${id}`}
                          data={feature.ressource.shape}
                          pointToLayer={(f, latlng) =>
                            L.marker(latlng, { icon: markerIcon })
                          }
                          onEachFeature={(f, layer) => {
                            layer.bindPopup(
                              feature.ressource?.name ?? "Ressource"
                            );
                          }}
                        />
                      ) : null;

                    // Freiwillige (Liste)
                    const teilnehmerLayer =
                      feature?.teilnehmer
                        ?.filter((t: any) => aFilter.teilnehmer[t.id])
                        .map((t: any) => (
                          <GeoJSON
                            key={`teilnehmer-${t.id}`}
                            data={t.shape}
                            pointToLayer={(f, latlng) =>
                              L.marker(latlng, { icon: freiwilligeIcon })
                            }
                            onEachFeature={(f, layer) => {
                              layer.bindPopup(
                                (f.properties?.vorname ?? "") +
                                  " " +
                                  (f.properties?.nachname ?? "")
                              );
                            }}
                          />
                        )) ?? [];

                    return [layer, ressourceLayer, ...teilnehmerLayer];
                  })}
                {filter.meineFreiwilligen &&
                  meineFreiwilligen.map((feature, index) => (
                    <GeoJSON
                      key={`freiwillige-${index}`}
                      data={feature!.shape!}
                      onEachFeature={(f, layer) => {
                        layer.bindPopup(
                          f.properties?.vorname + " " + f.properties?.nachname
                        );
                      }}
                    />
                  ))}
                {filter.alleOrganisationen &&
                  alleOrganistaionen.map((feature, index) => (
                    <GeoJSON
                      key={`alleOrganisationen-${index}`}
                      data={feature!}
                      onEachFeature={(f, layer) => {
                        layer.bindPopup(
                          f.properties?.vorname + " " + f.properties?.nachname
                        );
                      }}
                    />
                  ))}
                {filter.alleAktivitaeten &&
                  alleAktivitaeten.map((feature, index) => (
                    <GeoJSON
                      key={`alleAktivitaeten-${index}`}
                      data={feature!}
                      style={() => ({
                        color: "#007bff",
                        weight: 2,
                        fillOpacity: 0.3,
                      })}
                      onEachFeature={(f, layer) => {
                        layer.bindPopup(
                          f.properties?.vorname + " " + f.properties?.nachname
                        );
                      }}
                    />
                  ))}
                {filter.alleFreiwilligen &&
                  alleFreiwilligen.map((feature, index) => (
                    <GeoJSON
                      key={`alleFreiwilligen-${index}`}
                      data={feature!}
                      onEachFeature={(f, layer) => {
                        layer.bindPopup(
                          f.properties?.vorname + " " + f.properties?.nachname
                        );
                      }}
                    />
                  ))}
              </>
            )}
          </FeatureGroup>
          {selectedPoints.length >= 2 && (
            <RoutingMachine waypoints={selectedPoints} />
          )}
          <Button
            onClick={toggleShow}
            className="me-2 map-dropdown"
            style={{
              backgroundColor: "#fff",
              border: "2px solid rgba(0,0,0,0.2)",
            }}
          >
            <FaFilter color="black" />
          </Button>
          {show && container && (
            <div className="app-offcanvas-backdrop" onClick={handleClose} />
          )}
          {container && (
            <Offcanvas
              show={show}
              onHide={handleClose}
              container={container}
              className="map-offcanvas"
              backdrop={false}
            >
              <Offcanvas.Header
                closeButton
                style={{
                  borderRadius: "5px",
                  border: "2px solid rgba(0, 0, 0, 0.2)",
                }}
              >
                <Offcanvas.Title
                  style={{ fontWeight: "bold", fontSize: "30px" }}
                >
                  {t("map.filter.header.title")}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div>
                  <h1 className="map-dropdown_title">
                    {t("map.filter.organisation.alle.title")}
                  </h1>
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
                <DropdownDivider />
                <div style={{ padding: "10px" }}>
                  <div style={{ marginBottom: "10px" }}>
                    <h1 className="map-dropdown_title">
                      {t("map.filter.organisation.eigene.title")}
                    </h1>
                    <Form.Check
                      type="checkbox"
                      id="meineOrganisation"
                      label={t("map.filter.organisation.eigene")}
                      checked={filter.meineOrganisation}
                      onChange={() => updateFilter("meineOrganisation")}
                    />
                    <Form.Check
                      type="checkbox"
                      id="meineAktivitaeten"
                      label={t("map.filter.organisation.submenu.arrow")}
                      checked={filter.meineAktivitaeten}
                      onChange={() => updateFilter("meineAktivitaeten")}
                    />
                    {filter.meineAktivitaeten &&
                      meineAktivitaeten.length > 0 && (
                        <div style={{ marginLeft: "15px", marginTop: "5px" }}>
                          {meineAktivitaeten.map((feature, index) => {
                            const id = feature?.id ?? index;
                            const name = feature?.name ?? +` ${index + 1}`;
                            const aFilter = aktivitaetenFilter[id];

                            if (!aFilter) return null;

                            return (
                              <div key={id} style={{ marginBottom: "5px" }}>
                                {/* Aktivität */}
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Form.Check
                                    type="checkbox"
                                    id={`aktivitaet-${id}`}
                                    label={name}
                                    checked={aFilter.visible}
                                    onChange={() =>
                                      setAktivitaetenFilter((prev) => ({
                                        ...prev,
                                        [id]: {
                                          ...prev[id],
                                          visible: !prev[id].visible,
                                        },
                                      }))
                                    }
                                  />
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      marginRight: "10px",
                                    }}
                                    onClick={() =>
                                      setAktivitaetenFilter((prev) => ({
                                        ...prev,
                                        [id]: {
                                          ...prev[id],
                                          expanded: !prev[id].expanded,
                                        },
                                      }))
                                    }
                                  >
                                    {aFilter.expanded ? "▲" : "▼"}
                                  </span>
                                </div>

                                {/* Aktivität aufklappen */}
                                {aFilter.expanded && (
                                  <div
                                    style={{
                                      marginLeft: "25px",
                                      marginTop: "5px",
                                      paddingLeft: "10px",
                                      borderLeft: "2px solid rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    {/* Ressource */}
                                    {aFilter.visible ? (
                                      <strong style={{ fontSize: "0.9rem" }}>
                                        {t("ressourcen.card.link")}
                                      </strong>
                                    ) : (
                                      <strong
                                        style={{
                                          fontSize: "0.9rem",
                                          cursor: "default",
                                          opacity: 0.5,
                                        }}
                                      >
                                        {t("ressourcen.card.link")}
                                      </strong>
                                    )}
                                    <Form.Check
                                      type="checkbox"
                                      id={`ressource-${id}`}
                                      label={feature.ressource.name}
                                      disabled={!aFilter.visible}
                                      checked={
                                        aFilter.visible && aFilter.ressource
                                      }
                                      onChange={() =>
                                        setAktivitaetenFilter((prev) => ({
                                          ...prev,
                                          [id]: {
                                            ...prev[id],
                                            ressource: !prev[id].ressource,
                                          },
                                        }))
                                      }
                                    />

                                    {/* Teilnehmer */}
                                    {Object.entries(aFilter.teilnehmer).length >
                                      0 && (
                                      <>
                                        {aFilter.visible ? (
                                          <strong
                                            style={{ fontSize: "0.9rem" }}
                                          >
                                            {t(
                                              "map.filter.organisation.teilnehmer"
                                            )}
                                          </strong>
                                        ) : (
                                          <strong
                                            style={{
                                              fontSize: "0.9rem",
                                              cursor: "default",
                                              opacity: 0.5,
                                            }}
                                          >
                                            {t(
                                              "map.filter.organisation.teilnehmer"
                                            )}
                                          </strong>
                                        )}
                                      </>
                                    )}
                                    {Object.entries(aFilter.teilnehmer).map(
                                      ([tid, visible]) => (
                                        <Form.Check
                                          key={tid}
                                          type="checkbox"
                                          id={`teilnehmer-${tid}`}
                                          disabled={!aFilter.visible}
                                          label={feature.teilnehmer
                                            ?.filter(
                                              (t) => String(t.id) === tid
                                            )
                                            .map(
                                              (t) =>
                                                t.vorname + " " + t.nachname
                                            )}
                                          checked={aFilter.visible && visible}
                                          onChange={() =>
                                            setAktivitaetenFilter((prev) => ({
                                              ...prev,
                                              [id]: {
                                                ...prev[id],
                                                teilnehmer: {
                                                  ...prev[id].teilnehmer,
                                                  [tid]: !visible,
                                                },
                                              },
                                            }))
                                          }
                                          style={{ marginLeft: "10px" }}
                                        />
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          )}
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}
