import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsHeartPulse } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import aktivitaetService from "../../services/AktivitaetService";
import { AktivitaetModel } from "../../types/Types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { UserType } from "../../enums/Enums";

export default function AktivitaetenOverview() {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", null);

  const initialized = useRef(false);
  const [aktivitaeten, setAktivitaeten] = useState<AktivitaetModel[]>([]);
  const [angemeldeteAktivitaeten, setAngemeldeteAktivitaeten] = useState<
    AktivitaetModel[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (user.rolle === UserType.FREIWILLIGE) {
        aktivitaetService
          .getAngemeldete()
          .then((response) => {
            setAngemeldeteAktivitaeten(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Fehler beim Laden der Daten:", error);
            setError("Fehler beim Laden der Daten");
            setLoading(false);
          });
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
      } else if (user.rolle === UserType.ORGANISATION) {
        aktivitaetService
          .getErstellteAktivitaeten()
          .then((response) => {
            setAktivitaeten(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Fehler beim Laden der Daten:", error);
            setError("Fehler beim Laden der Daten");
            setLoading(false);
          });
      }
    }
  }, [user.rolle]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const navigateToDetail = (
    aktivitaet: AktivitaetModel,
    isTeilnehmer: boolean
  ) => {
    return navigate(`/aktivitäten/detail/${aktivitaet.id}`, {
      state: { aktivitaet, isTeilnehmer },
    });
  };

  return (
    <>
      <Header title={t("aktivitaeten.overview.title")} />
      <div className="body">
        {user.rolle === UserType.FREIWILLIGE && (
          <>
            <div>
              <>
                {console.log(
                  "angemeldeteAktivitaeten:",
                  angemeldeteAktivitaeten
                )}
              </>
              {angemeldeteAktivitaeten.length > 0 &&
                angemeldeteAktivitaeten.map((aktivitaet) => (
                  <>
                    <h5>{t("aktivitaeten.overview.registered.title")}</h5>
                    <Card
                      key={aktivitaet.id}
                      className="custom-card"
                      onClick={() => navigateToDetail(aktivitaet, true)}
                      style={{ marginBottom: 10 }}
                    >
                      {user.rolle === UserType.FREIWILLIGE && (
                        <CardHeader className="custom-cardheader">
                          <Col sm={1}>
                            <BsHeartPulse
                              size={30}
                              style={{ marginRight: 15 }}
                            />
                          </Col>
                          <Col>
                            <div>{aktivitaet.organisation!.name}</div>
                            {user.rolle === UserType.FREIWILLIGE && (
                              <div className="custom-cardheader_text">
                                {aktivitaet.name}
                              </div>
                            )}
                          </Col>
                        </CardHeader>
                      )}
                      <CardBody>
                        <Card.Text>{aktivitaet.beschreibung}</Card.Text>
                      </CardBody>
                    </Card>
                    <hr style={{ marginTop: 30 }} />
                  </>
                ))}
            </div>
          </>
        )}
        <h5 style={{ marginTop: 30 }}>
          {user.rolle === UserType.ORGANISATION
            ? t("aktivitaeten.overview.created.title")
            : t("aktivitaeten.overview.all.title")}
        </h5>
        <div>
          {aktivitaeten.length > 0 &&
            aktivitaeten.map((aktivitaet) => (
              <Card
                key={aktivitaet.id}
                className="custom-card"
                onClick={() => navigateToDetail(aktivitaet, false)}
                style={{ marginBottom: 10 }}
              >
                {user.rolle === UserType.ORGANISATION && (
                  <CardHeader className="custom-cardheader">
                    <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                    <div className="custom-cardheader_text">
                      {aktivitaet.name}
                    </div>
                  </CardHeader>
                )}
                {user.rolle === UserType.FREIWILLIGE && (
                  <CardHeader className="custom-cardheader">
                    <Col sm={1}>
                      <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                    </Col>
                    <Col>
                      <div>{aktivitaet.organisation!.name}</div>
                      {user.rolle === UserType.FREIWILLIGE && (
                        <div className="custom-cardheader_text">
                          {aktivitaet.name}
                        </div>
                      )}
                    </Col>
                  </CardHeader>
                )}
                <CardBody>
                  <Card.Text>{aktivitaet.beschreibung}</Card.Text>
                </CardBody>
              </Card>
            ))}
        </div>
        {user.rolle === UserType.ORGANISATION && (
          <>
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
          </>
        )}
      </div>
      <Footer displayAddAktivitaet />
    </>
  );
}
