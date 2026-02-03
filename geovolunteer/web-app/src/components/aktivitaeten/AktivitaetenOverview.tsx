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
import StatusIndicator, { aktivitaetStatus } from "../../utils/Utils";

export default function AktivitaetenOverview() {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", null);

  const initialized = useRef(false);

  const [laufendeAktivitaeten, setLaufendeAktivitaeten] = useState<
    AktivitaetModel[]
  >([]);
  const [bevorstehendeAktivitaeten, setBevorstehendeAktivitaeten] = useState<
    AktivitaetModel[]
  >([]);
  const [abgeschlosseneAktivitaeten, setAbgeschlosseneAktivitaeten] = useState<
    AktivitaetModel[]
  >([]);
  const [aktivitaeten, setAktivitaeten] = useState<AktivitaetModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      aktivitaetService
        .getLaufendeAktivitaeten()
        .then((response) => {
          setLaufendeAktivitaeten(response.data);
          setLoading(false);
          aktivitaetService
            .getBevorstehendeAktivitaeten()
            .then((resp) => {
              setBevorstehendeAktivitaeten(resp.data);
              setLoading(false);
              aktivitaetService
                .getAbgeschlosseneAktivitaeten()
                .then((resp) => {
                  setAbgeschlosseneAktivitaeten(resp.data);
                  setLoading(false);
                  if (user.rolle === UserType.FREIWILLIGE) {
                    aktivitaetService
                      .getAll()
                      .then((resp) => {
                        setAktivitaeten(resp.data);
                        setLoading(false);
                      })
                      .catch((error) => {
                        console.error("Fehler beim Laden der Daten:", error);
                        setLoading(false);
                      });
                  }
                })
                .catch((error) => {
                  console.error("Fehler beim Laden der Daten:", error);
                  setLoading(false);
                });
            })
            .catch((error) => {
              console.error("Fehler beim Laden der Daten:", error);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Fehler beim Laden der Daten:", error);
          setLoading(false);
        });
    }
  }, [user.rolle]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  const navigateToDetail = (
    aktivitaet: AktivitaetModel,
    isTeilnehmer: boolean,
  ) => {
    return navigate(`/aktivitäten/detail/${aktivitaet.id}`, {
      state: { aktivitaet, isTeilnehmer },
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
          {laufendeAktivitaeten.length > 0 &&
            laufendeAktivitaeten.map((aktivitaet) => (
              <Card
                key={`laufend-${aktivitaet.id}`}
                className="custom-card"
                onClick={() => navigateToDetail(aktivitaet, true)}
                style={{ marginBottom: 10 }}
              >
                {user.rolle === UserType.ORGANISATION && (
                  <CardHeader className="custom-cardheader--default">
                    <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                    <div className="custom-cardheader_text">
                      {aktivitaet.name}
                    </div>
                  </CardHeader>
                )}
                {user.rolle === UserType.FREIWILLIGE && (
                  <CardHeader className="custom-cardheader--default">
                    <Col sm={1}>
                      <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                    </Col>
                    <Col>
                      {user.rolle === UserType.FREIWILLIGE && (
                        <>
                          <div className="custom-cardheader_text">
                            {aktivitaet.name}
                          </div>
                          <div>{aktivitaet.organisation?.name}</div>
                        </>
                      )}
                    </Col>
                  </CardHeader>
                )}
                <CardBody>
                  <Card.Text>{aktivitaet.beschreibung}</Card.Text>
                  {user.rolle === UserType.ORGANISATION && (
                    <StatusIndicator aktivitaet={aktivitaet} />
                  )}
                </CardBody>
              </Card>
            ))}
        </div>
        <hr style={{ marginTop: 30 }} />
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.planed.title")}
        </h5>
        <div>
          {bevorstehendeAktivitaeten.length > 0 &&
            bevorstehendeAktivitaeten.map((aktivitaet) => (
              <Card
                key={`bevorstehend-${aktivitaet.id}`}
                className="custom-card"
                onClick={() => navigateToDetail(aktivitaet, true)}
                style={{ marginBottom: 10 }}
              >
                {user.rolle === UserType.ORGANISATION && (
                  <CardHeader className="custom-cardheader--default">
                    <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                    <div className="custom-cardheader_text">
                      {aktivitaet.name}
                    </div>
                  </CardHeader>
                )}
                {user.rolle === UserType.FREIWILLIGE && (
                  <CardHeader className="custom-cardheader--default">
                    <Col sm={1}>
                      <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                    </Col>
                    <Col>
                      {user.rolle === UserType.FREIWILLIGE && (
                        <>
                          <div className="custom-cardheader_text">
                            {aktivitaet.name}
                          </div>
                          <div>{aktivitaet.organisation?.name}</div>
                        </>
                      )}
                    </Col>
                  </CardHeader>
                )}
                <CardBody>
                  <Card.Text>{aktivitaet.beschreibung}</Card.Text>
                  <StatusIndicator aktivitaet={aktivitaet} />
                </CardBody>
              </Card>
            ))}
        </div>
        <hr style={{ marginTop: 30 }} />
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.done.title")}
        </h5>
        <div>
          {abgeschlosseneAktivitaeten.length > 0 &&
            abgeschlosseneAktivitaeten.map((aktivitaet) => (
              <Card
                key={`abgeschlossen-${aktivitaet.id}`}
                className="custom-card"
                onClick={() => navigateToDetail(aktivitaet, false)}
                style={{ marginBottom: 10 }}
              >
                <CardHeader className="custom-cardheader--done">
                  <Col sm={1}>
                    <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                  </Col>
                  <Col>
                    <>
                      <div className="custom-cardheader_text">
                        {aktivitaet.name}
                      </div>
                      <div>{aktivitaet.organisation?.name}</div>
                    </>
                  </Col>
                </CardHeader>

                <CardBody>
                  <Card.Text>{aktivitaet.beschreibung}</Card.Text>
                </CardBody>
              </Card>
            ))}
        </div>
        {user.rolle === UserType.FREIWILLIGE && (
          <>
            <hr style={{ marginTop: 30 }} />
            <h5 style={{ marginTop: 30 }}>
              {t("aktivitaeten.overview.all.title")}
            </h5>
            <div>
              {aktivitaeten.length > 0 &&
                aktivitaeten.map((aktivitaet) => (
                  <Card
                    key={`all-${aktivitaet.id}`}
                    className="custom-card"
                    onClick={() => navigateToDetail(aktivitaet, false)}
                    style={{ marginBottom: 10 }}
                  >
                    <CardHeader className="custom-cardheader--default">
                      <Col sm={1}>
                        <BsHeartPulse size={30} style={{ marginRight: 15 }} />
                      </Col>
                      <Col>
                        <>
                          <div className="custom-cardheader_text">
                            {aktivitaet.name}
                          </div>
                          <div>{aktivitaet.organisation?.name}</div>
                        </>
                      </Col>
                    </CardHeader>

                    <CardBody>
                      <Card.Text>{aktivitaet.beschreibung}</Card.Text>
                      <StatusIndicator aktivitaet={aktivitaet} />
                    </CardBody>
                  </Card>
                ))}
            </div>
          </>
        )}
      </div>
      <Footer displayAddAktivitaet />
    </>
  );
}
