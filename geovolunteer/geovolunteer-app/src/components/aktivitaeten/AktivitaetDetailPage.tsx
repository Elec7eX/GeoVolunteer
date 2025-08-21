import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Modal, Nav, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AktivitaetModel } from "../../types/Types";
import aktivitaetService from "../../services/AktivitaetService";
import { VerticalDivider } from "../../utils/Utils";
import MapComponent from "../karte/MapComponent";
import { PiMapPinArea } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { UserType } from "../../enums/Enums";
import { BsHeartPulse } from "react-icons/bs";

export default function AktivitaetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [user] = useLocalStorage("user", null);

  const { aktivitaetFromState, isTeilnehmer } = location.state;

  const [aktivitaet, setAktivitaet] = useState<AktivitaetModel | null>(null);
  const [position, setPosition]: any = useState(null);
  const [isShowMap, setIsShowMap] = useState<boolean>(false);
  const [show, setShow] = useState(false);

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

  const handleClose = () => setShow(false);

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
          <Card.Header>
            <Nav variant="tabs" defaultActiveKey="#first">
              <Nav.Item>
                <Nav.Link href="#first">{t("footer.icon.aktivitaet")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() =>
                    navigate(`/aktivitäten/ressource/detail/${aktivitaet.id}`, {
                      state: { aktivitaet },
                    })
                  }
                >
                  {t("ressourcen.card.link")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body style={{ position: "relative" }}>
            <Row>
              <Col md={3}>
                <BsHeartPulse size={75} style={{ marginLeft: 15 }} />
              </Col>
              <Col>
                <Card.Title>{aktivitaet.name}</Card.Title>
                <Card.Text>{aktivitaet.organisation?.name}</Card.Text>
                {user.rolle === UserType.ORGANISATION && (
                  <Row style={{ textAlign: "end" }}>
                    <Col>
                      <RiDeleteBinLine size={25} />
                    </Col>
                    <Col md="auto">
                      <FiEdit size={25} />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
            {aktivitaet.teilnehmer &&
              aktivitaet.teilnehmer.length < aktivitaet.teilnehmeranzahl && (
                <>
                  {!isTeilnehmer && user.rolle === UserType.FREIWILLIGE && (
                    <Button
                      className="btn custom-button_teilnehmen"
                      onClick={() =>
                        aktivitaetService
                          .addTeilnehmer(id!)
                          .then(() => navigate("/aktivitäten"))
                      }
                    >
                      <div className="text-white">
                        {t("aktivitaeten.detail.button.teilnehmen")}
                      </div>
                    </Button>
                  )}
                  {isTeilnehmer && user.rolle === UserType.FREIWILLIGE && (
                    <Button
                      className="btn custom-button_nichtTeilnehmen"
                      onClick={() =>
                        aktivitaetService
                          .removeTeilnehmer(id!)
                          .then(() => navigate("/aktivitäten"))
                      }
                    >
                      <div className="text-white">
                        {t("aktivitaeten.detail.button.nichtTeilnehmen")}
                      </div>
                    </Button>
                  )}
                </>
              )}
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
                  <div>
                    {aktivitaet.teilnehmer !== undefined && (
                      <>{aktivitaet.teilnehmer.length}/</>
                    )}
                    {aktivitaet.teilnehmeranzahl}
                  </div>
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
                    style={{ marginLeft: 100, color: "#00e7ff" }}
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
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>{t("aktivitaeten.remove.title")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{t("aktivitaeten.remove.text")}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t("button.nein")}
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  aktivitaetService
                    .deleteById(`${aktivitaet.id}`)
                    .then(() => navigate("/aktivitäten"))
                }
              >
                {t("button.ja")}
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      </div>
      <Footer />
    </>
  );
}
