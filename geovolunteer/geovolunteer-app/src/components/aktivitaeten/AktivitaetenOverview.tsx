import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Alert, Card, CardBody, CardHeader, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsHeartPulse } from "react-icons/bs";
import { useEffect, useState } from "react";
import aktivitaetService from "../../services/AktivitaetService";
import { AktivitaetModel } from "../../types/Types";

export default function AktivitaetenOverview() {
  const navigate = useNavigate();
  const [aktivitaeten, setAktivitaeten] = useState<AktivitaetModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    aktivitaetService
      .getAll()
      .then((response) => {
        setAktivitaeten(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Daten:", error);
        setError("Fehler beim Laden der Daten");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const navigateToDetail = (aktivitaet: AktivitaetModel) => {
    return navigate(`/aktivitäten/detail/${aktivitaet.id}`, {
      state: { aktivitaet },
    });
  };

  return (
    <>
      <Header title={t("aktivitaeten.overview.title")} />
      <div className="body">
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.created.title")}
        </h5>
        <div>
          {aktivitaeten.map((aktivitaet) => (
            <Card
              key={aktivitaet.id}
              onClick={() => navigateToDetail(aktivitaet)}
              style={{ marginBottom: 10 }}
            >
              <CardHeader>
                <BsHeartPulse style={{ marginRight: 5 }} />
                {aktivitaet.name}
              </CardHeader>
              <CardBody>
                <Card.Text>{aktivitaet.beschreibung}</Card.Text>
              </CardBody>
            </Card>
          ))}
        </div>
        <hr style={{ marginTop: 30 }} />
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.done.title")}
        </h5>
        <div>
          <Card onClick={() => navigateToDetail}>
            <CardHeader>
              <BsHeartPulse style={{ marginRight: 5 }} />
              Aktivitäts-Titel
            </CardHeader>
            <CardBody>
              <Card.Text>Aktivitäts-Detail</Card.Text>
            </CardBody>
          </Card>
          <Card style={{ marginTop: 10 }}>
            <CardHeader>
              <BsHeartPulse style={{ marginRight: 5 }} />
              Second Card
            </CardHeader>
            <CardBody>
              <Card.Text>Second Card Body</Card.Text>
            </CardBody>
          </Card>
        </div>
      </div>
      <Footer displayAddAktivitaet />
    </>
  );
}
