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
        <Navbar expand="lg">
          <Container>
            <div style={{ flex: 2, textAlign: "right" }}>
              <Row>
                <Col>
                  <Navbar.Brand>
                    <div className="header-title">{props.title}</div>
                  </Navbar.Brand>
                  <Navbar.Toggle
                    children={
                      <CgProfile
                        className="custom-icon profile-icon"
                        size={27}
                      />
                    }
                  />
                  <Navbar.Collapse id="navbarScroll">
                    <Nav
                      className="me-auto my-2 my-lg-0"
                      style={{ maxHeight: "100px" }}
                      navbarScroll
                    >
                      <NavDropdown
                        title={
                          <CgProfile
                            className="custom-icon profile-icon"
                            size={27}
                          />
                        }
                        id="navbarScrollingDropdown"
                      >
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>
                          {t("button.logout")}
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </Col>
              </Row>
            </div>
          </Container>
        </Navbar>
        {props.breadcrumb !== undefined && props.breadcrumb.current && (
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => props.breadcrumb!.navigate}>
              {props.breadcrumb?.previous}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {props.breadcrumb?.current}
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
      </div>
    </>
  );
};
