import {
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
  const { _logout }: any = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    _logout();
  };

  return (
    <>
      <div className="header">
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
                <IoIosArrowBack
                  style={{ width: 27, height: 27, color: "white" }}
                />
                <div style={{ color: "white" }}>{props.breadcrumb.title}</div>
              </Breadcrumb>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
};
