import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AktivitaetModel } from "../../types/Types";
import aktivitaetService from "../../services/AktivitaetService";
import { VerticalDivider } from "../../utils/Utils";
import MapComponent from "../karte/MapComponent";
import { PiMapPinArea } from "react-icons/pi";

export default function AktivitaetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const aktivitaetFromState = location.state?.aktivitaet;

  const [aktivitaet, setAktivitaet] = useState<AktivitaetModel | null>(null);
  const [position, setPosition]: any = useState(null);
  const [isShowMap, setIsShowMap] = useState<boolean>(false);

  useEffect(() => {
    if (aktivitaetFromState) {
      setAktivitaet(aktivitaetFromState);
      setPosition([
        aktivitaetFromState.latitude,
        aktivitaetFromState.longitude,
      ]);
    } else {
      aktivitaetService
        .getById(id!)
        .then((resp) => {
          setAktivitaet(resp.data);
          setPosition([resp.data.latitude, resp.data.longitude]);
        })
        .catch(() => alert("Fehler beim Laden der Daten"));
    }
  }, [id, aktivitaetFromState]);

  if (!aktivitaet) return <div>Lädt...</div>;

  return (
    <>
      <Header
        title={t("aktivitaeten.detail.title")}
        breadcrumb={{
          title: t("aktivitaeten.overview.title"),
          navigate: "/aktivitäten",
        }}
      />
      <div className="body">
        <Card>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Card.Img
                  style={{ width: 75, height: 75 }}
                  variant="top"
                  src={require("../../icons/logo192.png")}
                />
              </Col>
              <Col>
                <Card.Title>{aktivitaet.name}</Card.Title>
                <Card.Text>Organisationsbeschreibung hier</Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ marginTop: 10, height: "auto" }}>
          <Card.Body>
            <Card.Title>{t("aktivitaeten.detail.beschreibung")}</Card.Title>
            <Card.Text>{aktivitaet.beschreibung}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Row>
              <h5>{t("aktivitaeten.detail.zeit.title")}</h5>
              <Col md={5}>
                <div>
                  {t("aktivitaeten.detail.startDate")}: {aktivitaet.startDatum}
                  <br />
                  {t("aktivitaeten.detail.endDate")} : {aktivitaet.endDatum}
                </div>
              </Col>
              <Col md={1}>
                <VerticalDivider />
              </Col>
              <Col>
                <div>
                  {t("aktivitaeten.detail.startTime")}: {aktivitaet.startZeit}
                  <br />
                  {t("aktivitaeten.detail.endTime")} : {aktivitaet.endZeit}
                </div>
              </Col>
            </Row>
            <br />
            <Row>
              <Row>
                <Col>
                  <h5>{t("aktivitaeten.detail.transport")}</h5>
                </Col>
                <Col>
                  <h5>{t("aktivitaeten.detail.teilnehmerzahl")}</h5>
                </Col>
              </Row>
              <Row>
                <Col md={5}>
                  <div>{aktivitaet.transport}</div>
                </Col>
                <Col md={1}>
                  <VerticalDivider />
                </Col>
                <Col>
                  <div>{aktivitaet.teilnehmeranzahl}</div>
                </Col>
              </Row>
            </Row>
            <br />
            <Row>
              <h5>{t("aktivitaeten.detail.verpflegung")}</h5>
              <div>{aktivitaet.verpflegung}</div>
            </Row>
            <br />
            <Row>
              <h5>
                {t("aktivitaeten.detail.kontaktinfo.title")} &{" "}
                {t("aktivitaeten.detail.adresse.title")}
              </h5>
              <Col md={6}>
                <div>
                  {aktivitaet.vorname} {aktivitaet.nachname}
                </div>
                <div>{aktivitaet.email}</div>
                <div>{aktivitaet.telefon}</div>
              </Col>
              <Col md={1}>
                <VerticalDivider height="70px" />
              </Col>
              <Col>
                <div>
                  {aktivitaet.strasse} {aktivitaet.hausnummer}
                </div>
                <div>
                  {aktivitaet.plz} {aktivitaet.ort}
                </div>
                <div>
                  <PiMapPinArea
                    style={{ marginLeft: 100, color: "#0d6efd" }}
                    size={30}
                    onClick={() => setIsShowMap(!isShowMap)}
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ padding: 10, marginTop: 40 }}>
              {isShowMap && <MapComponent position={position} zoom={17} />}
            </Row>
          </Card.Body>
          <br />
          <Card.Body
            onClick={() =>
              navigate(`/aktivitäten/ressource/detail/${aktivitaet.id}`, {
                state: { aktivitaet },
              })
            }
          >
            <h5>{t("ressourcen.detail.uebersicht")}</h5>
            <br />
            <Row>
              <Col md={3}>
                <Card.Img
                  style={{ width: 75, height: 75 }}
                  variant="top"
                  src={require("../../icons/logo192.png")}
                />
              </Col>
              <Col>
                <Card.Title>{aktivitaet.ressource.name}</Card.Title>
                <Card.Text>{aktivitaet.ressource.beschreibung}</Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}
