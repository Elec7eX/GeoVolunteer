import { t } from "i18next";
import { Header } from "../header/Header";
import { Card, Row, Col, Nav } from "react-bootstrap";
import { Footer } from "../footer/Footer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import aktivitaetService from "../../services/AktivitaetService";
import { AktivitaetModel, RessourceModel } from "../../types/Types";
import { VerticalDivider } from "../../utils/Utils";
import { PiMapPinArea } from "react-icons/pi";
import { BsHeartPulse } from "react-icons/bs";
import MapComponent from "../karte/MapComponent";

export default function RessourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const aktivitaetFromState = location.state?.aktivitaet;
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [aktivitaet, setAktivitaet] = useState<AktivitaetModel | null>(null);
  const [ressource, setRessource] = useState<RessourceModel | null>(null);
  const [isShowMap, setIsShowMap] = useState<boolean>(false);

  useEffect(() => {
    if (aktivitaetFromState) {
      setAktivitaet(aktivitaetFromState);
      setRessource(aktivitaetFromState.ressource);
    } else {
      aktivitaetService
        .getById(id!)
        .then((resp) => {
          setAktivitaet(resp.data);
          setRessource(resp.data.ressource);
        })
        .catch(() => alert("Fehler beim Laden der Daten"));
    }
  }, [id, aktivitaetFromState]);

  if (!ressource || !aktivitaet) return <div>Lädt...</div>;
  return (
    <>
      <Header
        title={t("ressourcen.detail.uebersicht")}
        breadcrumb={{
          title: t("aktivitaeten.detail.title"),
          navigate: `/aktivitäten/detail/${aktivitaet.id}`,
          aktivitaetState: aktivitaet,
        }}
      />
      <div className="body">
        <Card>
          <Card.Header>
            <Nav variant="tabs" defaultActiveKey="#first">
              <Nav.Item>
                <Nav.Link
                  onClick={() =>
                    navigate(`/aktivitäten/detail/${aktivitaet.id}`, {
                      state: { aktivitaet },
                    })
                  }
                >
                  {t("footer.icon.aktivitaet")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#first">{t("ressourcen.card.link")}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <BsHeartPulse size={75} style={{ marginLeft: 15 }} />
              </Col>
              <Col>
                <Card.Title>{ressource.name}</Card.Title>
                <Card.Text>
                  <div>{aktivitaet.organisation?.name}</div>
                  <div>
                    {aktivitaet.organisation?.strasse}{" "}
                    {aktivitaet.organisation?.hausnummer}
                    {", "}
                    {aktivitaet.organisation?.plz}{" "}
                    {aktivitaet.organisation?.ort}
                  </div>
                </Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ marginTop: 10, height: "auto" }}>
          <Card.Body>
            <Card.Title>{t("ressourcen.detail.beschreibung")}</Card.Title>
            <Card.Text>{ressource.beschreibung}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Row>
              <h5>{t("ressourcen.detail.materialien")}</h5>
              <div>{ressource.materialien}</div>
            </Row>
            <br />
            <Row>
              <h5>{t("ressourcen.detail.sicherheitsanforderungen")}</h5>
              <div>{ressource.sicherheitsanforderungen}</div>
            </Row>
            <br />
            <Row>
              <h5>{t("ressourcen.detail.anmerkung")}</h5>
              <div>{ressource.anmerkung}</div>
            </Row>
            <br />
            <Row>
              <h5>
                {t("aktivitaeten.detail.kontaktinfo.title")} &{" "}
                {t("aktivitaeten.detail.adresse.title")}
              </h5>
              <Col md={6}>
                <div>
                  {ressource.vorname} {ressource.nachname}
                </div>
                <div>{ressource.email}</div>
                <div>{ressource.telefon}</div>
              </Col>
              <Col md={1}>
                <VerticalDivider height="70px" />
              </Col>
              <Col>
                <div>
                  {ressource.strasse} {ressource.hausnummer}
                </div>
                <div>
                  {ressource.plz} {ressource.ort}
                </div>
                <div>
                  <PiMapPinArea
                    style={{ marginLeft: 100, color: "#00e7ff" }}
                    size={30}
                    onClick={() => {
                      setIsShowMap(!isShowMap);
                      setTimeout(() => {
                        mapRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 200);
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ padding: 10, marginTop: 40 }} ref={mapRef}>
              {isShowMap && (
                <MapComponent geoJsonData={ressource.shape} zoom={17} />
              )}
            </Row>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}
