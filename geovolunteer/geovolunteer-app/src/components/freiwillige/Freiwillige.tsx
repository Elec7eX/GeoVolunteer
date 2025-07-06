import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, CardHeader, CardBody, Spinner, Alert } from "react-bootstrap";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserModel } from "../../types/Types";
import userService from "../../services/UserServices";

export default function Freiwillige() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigateToDetail = (user: UserModel) => {
    return navigate(`/freiwillige/detail/${user.id}`, {
      state: { user },
    });
  };

  useEffect(() => {
    userService
      .getFreiwillige()
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fehler beim Laden der Daten:", error);
        setError("Fehler beim Laden der Daten");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <Header title={t("freiwillige.header.title")} />
      <div className="body">
        <h5 style={{ marginTop: 30 }}>{t("freiwillige.header.title")}</h5>
        <div>
          {user.length > 0 &&
            user.map((user) => (
              <Card
                key={user.id}
                className="custom-card"
                onClick={() => navigateToDetail(user)}
              >
                <CardHeader className="custom-cardheader">
                  <IoPersonOutline size={30} style={{ marginRight: 15 }} />
                  <div className="custom-cardheader_text">
                    {user.vorname} {user.nachname}
                  </div>
                </CardHeader>
                <CardBody>
                  <Card.Text>
                    {user.strasse} {user.hausnummer}, {user.plz} {user.ort}
                    <br />
                    {user.email}
                  </Card.Text>
                </CardBody>
              </Card>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
