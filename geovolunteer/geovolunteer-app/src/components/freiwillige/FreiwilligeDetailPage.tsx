import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserModel, UserType } from "../../types/Types";
import { IoPersonOutline } from "react-icons/io5";
import { VerticalDivider } from "../../utils/Utils";
import { PiMapPinArea } from "react-icons/pi";
import MapComponent from "../karte/MapComponent";
import { RiDeleteBinLine } from "react-icons/ri";

export default function FreiwilligeDetailPage() {
  const location = useLocation();
  const userFromState = location.state?.user;

  const [user, setUser] = useState<UserModel | null>();
  const [isShowMap, setIsShowMap] = useState<boolean>(false);
  const [position, setPosition]: any = useState(null);
  const [radius, setRadius] = useState();

  useEffect(() => {
    if (userFromState) {
      setUser(userFromState);
      setPosition([userFromState.latitude, userFromState.longitude]);
      setRadius(userFromState.radius);
    } else {
    }
  }, [userFromState]);

  if (!user) return <div>Lädt...</div>;

  return (
    <>
      <Header
        title={t("freiwillige.detail.title")}
        breadcrumb={{
          title: t("freiwillige.header.title"),
          navigate: "/freiwillige",
        }}
      />
      <div className="body">
        <Card>
          <Card.Body>
            <Row>
              <Col md={3}>
                <IoPersonOutline size={75} style={{ marginRight: 15 }} />
              </Col>
              <Col>
                <Card.Title>
                  {user.vorname} {user.nachname}
                </Card.Title>
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
                {user.rolle === UserType.ADMIN && (
                  <Row style={{ textAlign: "end" }}>
                    <Col>
                      <RiDeleteBinLine size={25} />
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ marginTop: 10, height: "auto" }}>
          <Card.Body>
            <Card.Title>{t("aktivitaeten.detail.beschreibung")}</Card.Title>
            <Card.Text>{user.beschreibung}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Row>
              <h5>{t("aktivitaeten.detail.zeit.title")}</h5>
              <Col md={5}>
                <div>
                  {t("aktivitaeten.detail.startDate")}:{" "}
                  {user.verfuegbarVonDatum}
                  <br />
                  {t("aktivitaeten.detail.endDate")} : {user.verfuegbarBisDatum}
                </div>
              </Col>
              <Col md={1}>
                <VerticalDivider />
              </Col>
              <Col>
                <div>
                  {t("aktivitaeten.detail.startTime")}: {user.verfuegbarVonZeit}
                  <br />
                  {t("aktivitaeten.detail.endTime")} : {user.verfuegbarBisZeit}
                </div>
              </Col>
            </Row>
            <br />
            <Row>
              <h5>{t("profil.verfuegbar.ort.title")}</h5>
              <div>
                {user.strasse} {user.hausnummer}
              </div>
              <div>
                {user.plz} {user.ort}
              </div>
              <div>
                {t("profil.verfuegbar.umkreis")} {user.radius}
                {user.einheit === "M" ? "m" : "km"}
                <PiMapPinArea
                  style={{ marginLeft: 100, color: "#00e7ff" }}
                  size={30}
                  onClick={() => setIsShowMap(!isShowMap)}
                />
              </div>
            </Row>
            <Row style={{ padding: 10, marginTop: 40 }}>
              {isShowMap && (
                <MapComponent position={position} radius={radius} zoom={20} />
              )}
            </Row>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}
