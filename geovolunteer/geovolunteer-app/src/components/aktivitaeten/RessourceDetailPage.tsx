import { t } from "i18next";
import { Header } from "../header/Header";
import { Card, Row, Col } from "react-bootstrap";
import { Footer } from "../footer/Footer";

export default function RessourceDetailPage() {
  return (
    <>
      <Header
        title={t("ressourcen.detail.title")}
        breadcrumb={{
          title: t("aktivitaeten.detail.title"),
          navigate: "/aktivitäten/detail"
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
                <Card.Title>Title</Card.Title>
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
