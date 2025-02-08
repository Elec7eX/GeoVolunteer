import { Col, Container, Row } from "react-bootstrap";
import { IoHomeOutline } from "react-icons/io5";
import { BsHeartPulse } from "react-icons/bs";
import { BsMap } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
<<<<<<< Upstream, based on origin/main
import { useNavigate } from "react-router-dom";
import { IoAddCircleOutline } from "react-icons/io5";
=======
>>>>>>> 38cde22 Header & Footer design

type Props = {
  displayAddAktivitaet?: boolean;
};

export const Footer = (props: Props) => {
  const navigate = useNavigate();
  return (
    <>
<<<<<<< Upstream, based on origin/main
      {props.displayAddAktivitaet && (
        <div className="footer-add">
          <IoAddCircleOutline
            className="mx-5 custom-addIcon"
            onClick={() => navigate("/aktivitäten/erstellen")}
          />
        </div>
      )}
      <footer className="footer">
        <Container>
          <Row className="py-2">
            <Col>
              <div>
                <IoHomeOutline
                  className="text-white mx-5 custom-icon"
                  onClick={() => navigate("/")}
                />
                <BsHeartPulse
                  className="text-white mx-5 custom-icon"
                  onClick={() => navigate("/aktivitäten")}
                />
                <BsMap
                  className="text-white mx-5 custom-icon"
                  onClick={() => navigate("/map")}
                />
                <CiGlobe
                  className="text-white mx-5 custom-icon"
                  onClick={() => navigate("/organisation")}
                />
=======
      <footer className="footer">
        <Container>
          <Row className="py-2">
            <Col>
              <div>
                <a
                  href="/secret"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white mx-5"
                >
                  <IoHomeOutline className="custom-icon" />
                </a>
                <a
                  href="/secret"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white mx-5"
                >
                  <BsHeartPulse className="custom-icon" />
                </a>
                <a
                  href="/secret"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white mx-5"
                >
                  <BsMap className="custom-icon" />
                </a>
                <a
                  href="/secret"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white mx-5"
                >
                  <CiGlobe className="custom-icon" />
                </a>
>>>>>>> 38cde22 Header & Footer design
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};
