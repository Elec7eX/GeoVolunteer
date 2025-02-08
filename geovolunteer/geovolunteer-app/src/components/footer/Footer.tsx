import { Col, Container, Row } from "react-bootstrap";
import { IoHomeOutline } from "react-icons/io5";
import { BsHeartPulse } from "react-icons/bs";
import { BsMap } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
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
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};
