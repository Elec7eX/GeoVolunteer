import {
<<<<<<< Upstream, based on origin/main
  Breadcrumb,
  Col,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
  title: string;
  breadcrumb?: {
    title: string;
    navigate: string;
  };
};

export const Header = (props: Props) => {
  const { logout }: any = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

=======
  Button,
  Col,
  Container,
  Navbar,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { CgProfile } from "react-icons/cg";

type Props = {
  title: string;
};

export const Header = (props: Props) => {
>>>>>>> 38cde22 Header & Footer design
  return (
    <>
      <div className="header">
<<<<<<< Upstream, based on origin/main
        <Container>
          <Row>
            <Col md={2}>
              <Navbar>
                <Navbar.Collapse>
                  <Nav>
                    <NavDropdown
                      style={{ zIndex: 1050 }}
                      title={<CgProfile className="custom-icon" size={27} />}
                    >
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        {t("button.logout")}
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </Col>
            <Col md={{ span: 6, offset: 1 }}>
              <div className="header-title">{props.title}</div>
            </Col>
          </Row>
          {props.breadcrumb && (
            <Row>
              <Breadcrumb onClick={() => navigate(props.breadcrumb!.navigate)}>
                <IoIosArrowBack style={{width: 27, height: 27, color: "white"}} />
                <div style={{color: "white"}}>{props.breadcrumb.title}</div>
              </Breadcrumb>
            </Row>
          )}
        </Container>
=======
        <Navbar expand="lg">
          <Container>
            <div style={{ flex: 2, textAlign: "right" }}>
              <Row>
                <Col>
                  <Navbar.Brand>
                    {<div className="header-title">{props.title}</div>}
                  </Navbar.Brand>
                </Col>
                <Col>
                  <NavDropdown title={<CgProfile className="custom-icon profile-icon" size={27} />} id="collapsible-nav-dropdown">
                    <NavDropdown.Item href="/secret">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                </Col>
              </Row>
            </div>
          </Container>
        </Navbar>
>>>>>>> 38cde22 Header & Footer design
      </div>
    </>
  );
};
