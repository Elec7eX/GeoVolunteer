import { Col, Container, Row } from "react-bootstrap";
import { IoHomeOutline } from "react-icons/io5";
import { BsHeartPulse } from "react-icons/bs";
import { GrMapLocation } from "react-icons/gr";
import { CiGlobe } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { GrAddCircle } from "react-icons/gr";
import { t } from "i18next";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { UserType } from "../../enums/Enums";

type Props = {
  displayAddAktivitaet?: boolean;
};

export const Footer = (props: Props) => {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", null);

  return (
    <>
      <footer className="footer">
        <Container>
          <Row className="py-2 justify-content-center">
            <Col className="text-center">
              <div>
                <IoHomeOutline
                  className="text-white custom-icon"
                  onClick={() => navigate("/")}
                />
                <div className="text-white">{t("footer.icon.uebersicht")}</div>
              </div>
            </Col>
            <Col className="text-center">
              <div>
                <BsHeartPulse
                  className="text-white custom-icon"
                  onClick={() => navigate("/aktivitäten")}
                />
                <div className="text-white">{t("footer.icon.aktivitaet")}</div>
              </div>
            </Col>

            {props.displayAddAktivitaet &&
              user.rolle === UserType.ORGANISATION && (
                <Col>
                  <div>
                    <GrAddCircle
                      className="text-white custom-icon"
                      onClick={() => navigate("/aktivitäten/erstellen")}
                    />
                    <div className="text-white">{t("footer.icon.neu")}</div>
                  </div>
                </Col>
              )}
            <Col className="text-center">
              <div>
                <GrMapLocation
                  className="text-white custom-icon"
                  onClick={() => navigate("/map")}
                />
                <div className="text-white">{t("footer.icon.map")}</div>
              </div>
            </Col>
            <Col className="text-center">
              <div>
                <CiGlobe
                  className="text-white custom-icon"
                  onClick={() => navigate("/organisation")}
                />
                <div className="text-white">
                  {t("footer.icon.organisation")}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};
