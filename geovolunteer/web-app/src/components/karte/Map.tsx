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
import { Button, DropdownDivider, Form, Nav, Offcanvas } from "react-bootstrap";
import { FaFilter, FaRoute } from "react-icons/fa";
import { RoutingMachine } from "../karte/RoutingMachine";
import * as turf from "@turf/turf";

interface FilterType {
  meineOrganisation: boolean;
  meineAktivitaeten: boolean;
  meineFreiwilligen: boolean;
  alleOrganisationen: boolean;
  alleAktivitaeten: boolean;
  alleFreiwilligen: boolean;
}

interface ToolsType {
  routenplaner: boolean;
  distanzberechnung: boolean;
}

interface AktivitaetFilterType {
  visible: boolean;
  expanded: boolean;
  ressource: boolean;
  teilnehmer: { [id: string]: boolean };
}

export default function Map() {
  const [user] = useLocalStorage("user", null);
  const initialized = useRef(false);
  const drawnItemsRef = useRef(null);

  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(false);

  const [selectedPoints, setSelectedPoints] = useState<L.LatLng[]>([]);
  const [distanceLine, setDistanceLine] = useState<L.Polyline | null>(null);
  const [distanceLabel, setDistanceLabel] = useState<L.Marker | null>(null);

  const [activeTab, setActiveTab] = useState("filter"); // "filter" oder "aktionen"

  const [filter, setFilter] = useState<FilterType>({
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

  const [alleOrganistaionen, setAlleOrganisationen] = useState<UserModel[]>([]);
  const [alleAktivitaeten, setAlleAktivitaeten] = useState<AktivitaetModel[]>(
    []
  );
  const [alleFreiwilligen, setAlleFreiwilligen] = useState<UserModel[]>([]);

  const [tools, setTools] = useState<ToolsType>({
    routenplaner: false,
    distanzberechnung: false,
  });

  const toolsRef = useRef(tools);

  // ref immer aktuell halten
  useEffect(() => {
    toolsRef.current = tools;
  }, [tools]);

  useEffect(() => {
    if (!tools.routenplaner || !tools.distanzberechnung) {
      setSelectedPoints([]); // entfernt Waypoints → RoutingMachine wird unmounten
    }
  }, [tools.routenplaner, tools.distanzberechnung]);

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
          const organisationenShapes: UserModel[] = resp.data;
          setAlleOrganisationen(organisationenShapes);
        }
      });
    }
    if (filterName === "alleAktivitaeten" && alleAktivitaeten.length < 1) {
      aktivitaetService.getAll().then((resp) => {
        if (resp.status === 200) {
          const aktivitaetenShapes: AktivitaetModel[] = resp.data;
          setAlleAktivitaeten(aktivitaetenShapes);
        }
      });
    }
    if (filterName === "alleFreiwilligen" && alleFreiwilligen.length < 1) {
      userService.getFreiwillige().then((resp) => {
        if (resp.status === 200) {
          const freiwilligenShapes: UserModel[] = resp.data;
          setAlleFreiwilligen(freiwilligenShapes);
        }
      });
    }
    setFilter((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const updateTools = (toolName: keyof ToolsType) => {
    setTools((prev) => {
      const newState = { ...prev, [toolName]: !prev[toolName] };

      // wenn wir den Routenplaner gerade ausschalten -> Punkte löschen
      if (toolName === "routenplaner" && prev.routenplaner) {
        setSelectedPoints([]);
      }

      return newState;
    });
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

  function getPolygonCenter(layer: any): L.LatLng {
    const geometry = layer.feature?.geometry;

    if (!geometry) {
      // Fallback → Marker oder Klickkoordinate
      if (layer.getLatLng) return layer.getLatLng();
      return layer.getBounds ? layer.getBounds().getCenter() : L.latLng(0, 0);
    }

    let coords: [number, number][] = [];

    switch (geometry.type) {
      case "Polygon":
        // Polygon → alle Punkte flatten
        coords = geometry.coordinates.flat();
        break;

      case "MultiPolygon":
        // Multipolygon → alle Punkte aller Polygone flatten
        coords = geometry.coordinates.flat(2);
        break;

      case "Point":
        return L.latLng(geometry.coordinates[1], geometry.coordinates[0]);

      default:
        // Fallback: Bounding Box
        if (layer.getBounds) return layer.getBounds().getCenter();
        return L.latLng(0, 0);
    }

    if (coords.length === 0) return L.latLng(0, 0);

    // Berechne Durchschnittsposition
    const sum = coords.reduce(
      (acc: [number, number], [lng, lat]: [number, number]) => [
        acc[0] + lat,
        acc[1] + lng,
      ],
      [0, 0]
    );

    const count = coords.length;
    return L.latLng(sum[0] / count, sum[1] / count);
  }

  const handleRoutingClick = (e: any) => {
    if (!toolsRef.current.routenplaner && !toolsRef.current.distanzberechnung)
      return;

    const layer = e.target;
    const latlng = getPolygonCenter(layer);

    setSelectedPoints((prev) => {
      // Prüfen, ob der Punkt schon gesetzt ist
      const isDuplicate = prev.some(
        (p) => p.lat === latlng.lat && p.lng === latlng.lng
      );

      if (isDuplicate) {
        // Visuelles Feedback: kurzes Popup
        L.popup({
          closeButton: false,
          autoClose: true,
          className: "duplicate-popup",
        })
          .setLatLng(latlng)
          .setContent("Dieser Punkt wurde bereits gewählt")
          .openOn(layer._map); // auf der Karte öffnen

        // Popup nach 1,5 Sekunden schließen
        setTimeout(() => {
          layer._map.closePopup();
        }, 1500);

        return prev; // Punkt nicht hinzufügen
      }
      if (prev.length < 2) return [...prev, latlng];
      return [latlng]; // alte Route überschreiben
    });
  };

  useEffect(() => {
    const map = (drawnItemsRef.current as any)?._map as L.Map | undefined;
    if (!map) return;

    // Nur ausführen, wenn der Routenplaner aktiv ist
    if (!toolsRef.current.distanzberechnung) {
      if (distanceLine) {
        distanceLine.remove();
        setDistanceLine(null);
      }
      if (distanceLabel) {
        distanceLabel.remove();
        setDistanceLabel(null);
      }
      return;
    }

    // Wenn zwei Punkte gesetzt sind → Distanz anzeigen
    if (selectedPoints.length === 2) {
      const [p1, p2] = selectedPoints;

      const from = turf.point([p1.lng, p1.lat]);
      const to = turf.point([p2.lng, p2.lat]);
      const options = { units: "kilometers" as "kilometers" };
      const distance = turf.distance(from, to, options);

      // Alte Linie/Label entfernen
      if (distanceLine) distanceLine.remove();
      if (distanceLabel) distanceLabel.remove();

      // Linie zeichnen
      const line = L.polyline([p1, p2], { color: "red", weight: 3 }).addTo(map);

      // Mittelpunkt
      const midLat = (p1.lat + p2.lat) / 2;
      const midLng = (p1.lng + p2.lng) / 2;

      // Label erzeugen
      const label = L.marker([midLat, midLng], {
        icon: L.divIcon({
          className: "distance-label",
          html: `<span style="
                  background: white; 
                  border: 1px solid gray; 
                  padding: 2px 6px; 
                  border-radius: 4px; 
                  font-size: 12px;
                  white-space: nowrap;
                  ">
                    ${distance.toFixed(2)} km
                </span>`,
        }),
        interactive: false,
      }).addTo(map);

      setDistanceLine(line);
      setDistanceLabel(label);
    } else {
      // weniger als 2 Punkte → alte Elemente löschen
      if (distanceLine) {
        distanceLine.remove();
        setDistanceLine(null);
      }
      if (distanceLabel) {
        distanceLabel.remove();
        setDistanceLabel(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPoints, toolsRef.current.distanzberechnung]);

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
                      layer.on("click", handleRoutingClick);
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
                          layer.on("click", handleRoutingClick);
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
                            layer.on("click", handleRoutingClick);
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
                              layer.on("click", handleRoutingClick);
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
                      data={feature.shape!}
                      pointToLayer={(feature, latlng) => {
                        return L.marker(latlng, { icon: orgIcon });
                      }}
                      onEachFeature={(f, layer) => {
                        layer.bindPopup(f.properties?.name ?? "Organisation");
                        layer.on("click", handleRoutingClick);
                      }}
                    />
                  ))}
                {filter.alleAktivitaeten &&
                  alleAktivitaeten.map((feature, index) => (
                    <GeoJSON
                      key={`alleAktivitaeten-${index}`}
                      data={feature.shape!}
                      pointToLayer={(feature, latlng) => {
                        return L.marker(latlng, { icon: aktivitaetIcon });
                      }}
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
                      data={feature.shape!}
                      pointToLayer={(f, latlng) =>
                        L.marker(latlng, { icon: freiwilligeIcon })
                      }
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
          {(tools.routenplaner || tools.distanzberechnung) &&
            selectedPoints.length >= 2 && (
              <>
                {tools.routenplaner && (
                  <RoutingMachine waypoints={selectedPoints} />
                )}
                <Button
                  onClick={() => {
                    setSelectedPoints([]);
                    if (distanceLine) {
                      distanceLine.remove();
                      setDistanceLine(null);
                    }
                    if (distanceLabel) {
                      distanceLabel.remove();
                      setDistanceLabel(null);
                    }
                  }}
                  variant="light"
                  style={{
                    position: "absolute",
                    marginRight: "40px",
                    top: "10px",
                    right: "10px",
                    zIndex: 900,
                    border: "2px solid rgba(0,0,0,0.3)",
                  }}
                >
                  <FaRoute color="black" /> Route zurücksetzen
                </Button>
              </>
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
                  {activeTab === "filter" && t("map.filter.header.title")}
                  {activeTab === "tools" && t("map.tools.header.title")}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav variant="tabs" defaultActiveKey="filter" className="mb-3">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "filter"}
                      onClick={() => setActiveTab("filter")}
                    >
                      {t("map.filter.header.title")}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === "tools"}
                      onClick={() => setActiveTab("tools")}
                    >
                      {t("map.tools.header.title")}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                {activeTab === "filter" && (
                  <>
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
                            <div
                              style={{ marginLeft: "15px", marginTop: "5px" }}
                            >
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
                                          borderLeft:
                                            "2px solid rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        {/* Ressource */}
                                        {aFilter.visible ? (
                                          <strong
                                            style={{ fontSize: "0.9rem" }}
                                          >
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
                                        {Object.entries(aFilter.teilnehmer)
                                          .length > 0 && (
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
                                              checked={
                                                aFilter.visible && visible
                                              }
                                              onChange={() =>
                                                setAktivitaetenFilter(
                                                  (prev) => ({
                                                    ...prev,
                                                    [id]: {
                                                      ...prev[id],
                                                      teilnehmer: {
                                                        ...prev[id].teilnehmer,
                                                        [tid]: !visible,
                                                      },
                                                    },
                                                  })
                                                )
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
                  </>
                )}
                {activeTab === "tools" && (
                  <>
                    <div>
                      <Form.Check
                        type="switch"
                        id="routingSwitch"
                        label={t("map.tools.routing.title")}
                        checked={tools.routenplaner}
                        onChange={() => updateTools("routenplaner")}
                      />
                    </div>
                    <div>
                      <Form.Check
                        type="switch"
                        id="distanceSwitch"
                        label={t("map.tools.distance.title")}
                        checked={tools.distanzberechnung}
                        onChange={() => updateTools("distanzberechnung")}
                      />
                    </div>
                  </>
                )}
              </Offcanvas.Body>
            </Offcanvas>
          )}
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}
