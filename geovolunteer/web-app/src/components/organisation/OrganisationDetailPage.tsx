import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserModel, UserType } from "../../types/Types";
import { VerticalDivider } from "../../utils/Utils";
import { PiMapPinArea } from "react-icons/pi";
import MapComponent from "../karte/MapComponent";
import { RiDeleteBinLine } from "react-icons/ri";
import { CiGlobe } from "react-icons/ci";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import userService from "../../services/UserServices";

export default function OrganisationDetailPage() {
  const location = useLocation();
  const [user] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const organisationFromState = location.state?.user;
  const [organisation, setOrganisation] = useState<UserModel | null>();
  const [isShowMap, setIsShowMap] = useState<boolean>(false);
  const [position, setPosition]: any = useState(null);

  useEffect(() => {
    if (organisationFromState) {
      setOrganisation(organisationFromState);
      setPosition([
        organisationFromState.latitude,
        organisationFromState.longitude,
      ]);
    }
  }, [organisationFromState]);

  if (!organisation) return <div>Lädt...</div>;

  return (
    <>
      <Header
        title={t("organisation.detail.title")}
        breadcrumb={{
          title: t("organisation.overview.title"),
          navigate: "/organisation",
        }}
      />
      <div className="body">
        <Card>
          <Card.Body>
            <Row>
              <Col md={3}>
                <CiGlobe size={75} style={{ marginRight: 15 }} />
              </Col>
              <Col>
                <Card.Title>{organisation.name}</Card.Title>
                <Card.Text>{organisation.webseite}</Card.Text>
                {user.rolle === UserType.ADMIN && (
                  <Row style={{ textAlign: "end" }}>
                    <Col>
                      <RiDeleteBinLine
                        size={25}
                        onClick={() =>
                          userService
                            .remove(organisation.id)
                            .then(() => navigate("/freiwillige"))
                        }
                      />
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
            <Card.Text>{organisation.beschreibung}</Card.Text>
          </Card.Body>
          <Card.Body>
            <Row>
              <Col>
                <h5>{t("profil.organisationdaten.addresse.title")}</h5>
                <div>
                  {organisation.strasse} {organisation.hausnummer}
                </div>
                <div>
                  {organisation.plz} {organisation.ort}{" "}
                  <PiMapPinArea
                    style={{ marginLeft: 100, color: "#00e7ff" }}
                    size={30}
                    onClick={() => setIsShowMap(!isShowMap)}
                  />
                </div>
              </Col>
              <Col md={2}>
                <VerticalDivider />
              </Col>
              <Col>
                <h5>{t("organisation.detail.kontakt")}</h5>
                <div>{organisation.email}</div>
                <div>{organisation.telefon}</div>
              </Col>
            </Row>
            <Row style={{ padding: 10, marginTop: 40 }}>
              {isShowMap && <MapComponent position={position} zoom={20} />}
            </Row>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </>
  );
}
