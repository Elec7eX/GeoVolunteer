import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AktivitaetModel } from "../../types/Types";
import aktivitaetService from "../../services/AktivitaetService";

export default function AktivitaetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const aktivitaetFromState = location.state?.aktivitaet;

  const [aktivitaet, setAktivitaet] = useState<AktivitaetModel | null>(null);

  useEffect(() => {
    if (aktivitaetFromState) {
      setAktivitaet(aktivitaetFromState);
    } else {
      aktivitaetService
        .getById(id!)
        .then((resp) => {
          setAktivitaet(resp.data);
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
        <Card style={{ marginTop: 10, height: "100%" }}>
          <Card.Body>
            <Card.Title>Beschreibung</Card.Title>
            <Card.Text>Weitere Beschreibung hier</Card.Text>
          </Card.Body>
          <Card.Body>
            <Card.Title>Örtliche Verfügbarkeit</Card.Title>
            <Card.Text>Beschreibung hier</Card.Text>
          </Card.Body>
          <Card.Body>
            <Card.Title>Zeitliche Verfügbarkeit</Card.Title>
            <Card.Text>Beschreibung hier</Card.Text>
          </Card.Body>
          <Card.Body
            onClick={() => navigate("/aktivitäten/detail/ressourceDetail")}
          >
            <Row>
              <Col md={3}>
                <Card.Img
                  style={{ width: 75, height: 75 }}
                  variant="top"
                  src={require("../../icons/logo192.png")}
                />
              </Col>
              <Col>
                <Card.Title>Ressource</Card.Title>
                <Card.Text>Ressource-Beschreibung hier</Card.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}
