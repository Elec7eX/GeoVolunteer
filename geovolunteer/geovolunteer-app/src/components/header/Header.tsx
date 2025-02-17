import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  breadcrumb?: {
    previous: string;
    current: string;
    navigate: any;
  };
  breadcrumbTitle?: string;
};

export const Header = (props: Props) => {
  const { logout }: any = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
        </Container>
      </div>
    </>
  );
};
