import { t } from "i18next";
import { Header } from "../header/Header";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Footer } from "../footer/Footer";
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import aktivitaetService from "../../services/AktivitaetService";
import { AktivitaetModel, RessourceModel } from "../../types/Types";
import { VerticalDivider } from "../../utils/Utils";

export default function RessourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const aktivitaetFromState = location.state?.aktivitaet;

  const [aktivitaet, setAktivitaet] = useState<AktivitaetModel | null>(null);
  const [ressource, setRessource] = useState<RessourceModel | null>(null);

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
        title={t("ressourcen.detail.title")}
        breadcrumb={{
          title: t("aktivitaeten.detail.title"),
          navigate: `/aktivitäten/detail/${aktivitaet.id}`,
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
                <Card.Title>{ressource.name}</Card.Title>
                <Card.Text>Organisationsbeschreibung hier</Card.Text>
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
                  <Button
                    variant="link"
                    onClick={undefined}
                    style={{ padding: 0 }}
                  >
                    Auf der Karte anzeigen
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}
