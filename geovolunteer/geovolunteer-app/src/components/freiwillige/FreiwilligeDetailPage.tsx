import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserModel, UserType } from "../../types/Types";
import { IoPersonOutline } from "react-icons/io5";
import { VerticalDivider } from "../../utils/Utils";
import { PiMapPinArea } from "react-icons/pi";
import MapComponent from "../karte/MapComponent";
import { RiDeleteBinLine } from "react-icons/ri";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import userService from "../../services/UserServices";

export default function FreiwilligeDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const freiwilligeFromState = location.state?.user;

  const [user] = useLocalStorage("user", null);

  const [freiwillige, setFreiwillige] = useState<UserModel | null>();
  const [isShowMap, setIsShowMap] = useState<boolean>(false);
  const [position, setPosition]: any = useState(null);
  const [radius, setRadius] = useState();

  useEffect(() => {
    if (freiwilligeFromState) {
      setFreiwillige(freiwilligeFromState);
      setPosition([
        freiwilligeFromState.latitude,
        freiwilligeFromState.longitude,
      ]);
      setRadius(freiwilligeFromState.radius);
    } else {
    }
  }, [freiwilligeFromState]);

  if (!freiwillige) return <div>Lädt...</div>;

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
                  {freiwillige.vorname} {freiwillige.nachname}
                </Card.Title>
                <Card.Text>
                  {freiwillige.strasse} {freiwillige.hausnummer}
                  {freiwillige.plz && freiwillige.ort && (
                    <>
                      , {freiwillige.plz} {freiwillige.ort}
                      <br />
                    </>
                  )}
                  {freiwillige.email}
                </Card.Text>
                {user.rolle === UserType.ADMIN && (
                  <>
                    <Row style={{ textAlign: "end" }}>
                      <Col>
                        <RiDeleteBinLine
                          size={25}
                          onClick={() =>
                            userService
                              .remove(freiwillige.id)
                              .then(() => navigate("/freiwillige"))
                          }
                        />
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ marginTop: 10, height: "auto" }}>
          <Card.Body>
            <Card.Title>{t("aktivitaeten.detail.beschreibung")}</Card.Title>
            <Card.Text>{freiwillige.beschreibung}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Row>
              <h5>{t("aktivitaeten.detail.zeit.title")}</h5>
              <Col md={5}>
                <div>
                  {t("aktivitaeten.detail.startDate")}:{" "}
                  {freiwillige.verfuegbarVonDatum}
                  <br />
                  {t("aktivitaeten.detail.endDate")} :{" "}
                  {freiwillige.verfuegbarBisDatum}
                </div>
              </Col>
              <Col md={1}>
                <VerticalDivider />
              </Col>
              <Col>
                <div>
                  {t("aktivitaeten.detail.startTime")}:{" "}
                  {freiwillige.verfuegbarVonZeit}
                  <br />
                  {t("aktivitaeten.detail.endTime")} :{" "}
                  {freiwillige.verfuegbarBisZeit}
                </div>
              </Col>
            </Row>
            <br />
            <Row>
              <h5>{t("profil.verfuegbar.ort.title")}</h5>
              <div>
                {freiwillige.strasse} {freiwillige.hausnummer}
              </div>
              <div>
                {freiwillige.plz} {freiwillige.ort}
              </div>
              <div>
                {t("profil.verfuegbar.umkreis")} {freiwillige.radius}
                {freiwillige.einheit === "M" ? "m" : "km"}
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
