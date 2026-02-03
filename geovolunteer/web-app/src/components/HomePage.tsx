import { Header } from "./header/Header";
import { t } from "i18next";
import { Footer } from "./footer/Footer";
import AktivitaetenByKategorien from "./statistik/AktivitaetenByKategorien";
import AktionsRadius from "./statistik/AktionsRadius";
import OrganisationenDistanz from "./statistik/OrganisationenDistanz";
import { Card, CardHeader, Col, CardBody } from "react-bootstrap";
import { BsHeartPulse } from "react-icons/bs";
import { UserType } from "../enums/Enums";
import StatusIndicator, { aktivitaetStatus } from "../utils/Utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AktivitaetModel } from "../types/Types";
import aktivitaetService from "../services/AktivitaetService";
import FreiwilligenDistanz from "./statistik/FreiwilligenDistanz";
import FreiwilligenAktivitaetenDistanz from "./statistik/FreiwilligenAktivitaetenDistanz";

export default function HomePage() {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", null);

  const [laufendeAktivitaeten, setLaufendeAktivitaeten] = useState<
    AktivitaetModel[]
  >([]);

  useEffect(() => {
    if (user.rolle !== UserType.ADMIN) {
      aktivitaetService.getLaufendeAktivitaeten().then((response) => {
        setLaufendeAktivitaeten(response.data);
      });
    }
  }, []);

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
      <Header title={t("home.title")} />
      {user.rolle !== UserType.ADMIN ? (
        <>
          <div className="body">
            <h5 style={{ marginTop: 30 }}>
              {t("aktivitaeten.overview.created.title")}
            </h5>
            <div>
              {laufendeAktivitaeten &&
                laufendeAktivitaeten.length > 0 &&
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
            <h5 style={{ marginTop: 30 }}>{t("stat.title")}</h5>
            <AktivitaetenByKategorien />
            {user.rolle === UserType.FREIWILLIGE && (
              <>
                <AktionsRadius />
                <OrganisationenDistanz />
              </>
            )}
            {user.rolle === UserType.ORGANISATION && (
              <>
                <FreiwilligenDistanz />
                <FreiwilligenAktivitaetenDistanz />
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="body">Startseite</div>
        </>
      )}
      <Footer />
    </>
  );
}
