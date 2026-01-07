import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, CardHeader, CardBody, Spinner, Col } from "react-bootstrap";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AktivitaetModel, UserModel } from "../../types/Types";
import userService from "../../services/UserServices";
import aktivitaetService from "../../services/AktivitaetService";

export default function Freiwillige() {
  const navigate = useNavigate();

  const [aktivitaet, setAktivitaet] = useState<AktivitaetModel[]>([]);
  const [freiwillige, setFreiwillige] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    aktivitaetService
      .getLaufendeUndBevorstehendeAktivitaeten()
      .then((resp) => {
        setAktivitaet(resp.data);
      })
      .then(() => {
        userService
          .getFreiwillige()
          .then((response) => {
            setFreiwillige(response.data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const navigateToDetail = (user: UserModel) => {
    return navigate(`/freiwillige/detail/${user.id}`, {
      state: { user },
    });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <Header title={t("freiwillige.header.title")} />
      <div className="body">
        <h4 style={{ marginTop: 30 }}>
          {t("map.filter.organisation.teilnehmer")}
        </h4>
        {aktivitaet.map((aktivitaet) =>
          aktivitaet.teilnehmer!.map((user) => {
            return (
              <Card
                key={`${user.id}-${aktivitaet.id}`}
                className="custom-card"
                onClick={() => navigateToDetail(user)}
                style={{ marginBottom: 10 }}
              >
                <CardHeader className="custom-cardheader--available">
                  <Col sm={1}>
                    <IoPersonOutline size={27} style={{ marginRight: 15 }} />
                  </Col>
                  <Col>
                    <div className="custom-cardheader_text">
                      {user.vorname} {user.nachname}{" "}
                    </div>
                    <div>{aktivitaet.name}</div>
                  </Col>{" "}
                </CardHeader>
                <CardBody>
                  <Card.Text>
                    {user.strasse} {user.hausnummer}
                    {user.plz && user.ort && (
                      <>
                        , {user.plz} {user.ort}
                        <br />
                      </>
                    )}
                    {user.email}
                  </Card.Text>
                </CardBody>
              </Card>
            );
          })
        )}
        <h4 style={{ marginTop: 30 }}>{t("freiwillige.header.title")}</h4>
        {freiwillige.length > 0 &&
          freiwillige.map((user) => (
            <Card
              key={`freiwillige-${user.id}`}
              className="custom-card"
              onClick={() => navigateToDetail(user)}
              style={{ marginBottom: 10 }}
            >
              <CardHeader className="custom-cardheader--available">
                <IoPersonOutline size={27} style={{ marginRight: 15 }} />
                <div className="custom-cardheader_text">
                  {user.vorname} {user.nachname}
                </div>
              </CardHeader>
              <CardBody>
                <Card.Text>
                  {user.strasse} {user.hausnummer}
                  {user.plz && user.ort && (
                    <>
                      , {user.plz} {user.ort}
                      <br />
                    </>
                  )}
                  {user.email}
                </Card.Text>
              </CardBody>
            </Card>
          ))}
      </div>
      <Footer />
    </>
  );
}
