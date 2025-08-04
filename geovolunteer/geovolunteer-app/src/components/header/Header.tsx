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
import userService from "../../services/UserServices";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { UserType } from "../../enums/Enums";

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
  const [user] = useLocalStorage("user", null);

  const handleLogout = () => {
    userService.logout().then(() => _logout());
  };

  return (
    <>
      <div className="header">
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <div className="header-title">{props.title}</div>
            </Col>
            <Col md={2}>
              <Navbar>
                <Navbar.Collapse>
                  <Nav>
                    <NavDropdown
                      style={{ zIndex: 1050 }}
                      title={<CgProfile className="custom-icon" size={32} />}
                      align="end"
                    >
                      <NavDropdown.Item disabled>
                        <div style={{ fontStyle: "italic", marginBottom: 10 }}>
                          {user.rolle === UserType.ADMIN && user.login}
                          {user.rolle === UserType.ORGANISATION && user.name}
                          {user.rolle === UserType.FREIWILLIGE && (
                            <>
                              {user.vorname} {user.nachname}
                            </>
                          )}
                        </div>
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => navigate("/profil")}>
                        {t("button.profile")}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={handleLogout}>
                        {t("button.logout")}
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
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
