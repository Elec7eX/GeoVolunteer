import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, CardHeader, CardBody, Spinner, Alert } from "react-bootstrap";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GeoJsonFeature, UserModel } from "../../types/Types";
import userService from "../../services/UserServices";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { mockOrganisation } from "../../mockData/userMock";
import { AdressInputEnum } from "../../enums/Enums";

export default function Organisation() {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", null);

  const [organisationen, setOrganisationen] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigateToDetail = (user: UserModel) => {
    return navigate(`/organisation/detail/${user.id}`, {
      state: { user },
    });
  };

  useEffect(() => {
    if (user.id !== 3000) {
      userService
        .getOrganisationen()
        .then((response) => {
          setOrganisationen(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      const shape: GeoJsonFeature = {
        geometry: {
          coordinates: mockOrganisation.shape.geometry.coordinates,
          type: "Point",
        },
        type: "Feature",
        properties: {},
      };
      setOrganisationen([
        {
          id: mockOrganisation.id,
          rolle: mockOrganisation.rolle,
          login: mockOrganisation.login,
          email: mockOrganisation.email,
          password: mockOrganisation.password,
          name: mockOrganisation.name,
          telefon: mockOrganisation.telefon,
          webseite: mockOrganisation.webseite,
          addresseInput: AdressInputEnum.Manual,
          strasse: mockOrganisation.strasse,
          hausnummer: mockOrganisation.hausnummer,
          plz: mockOrganisation.plz,
          ort: mockOrganisation.ort,
          shape: shape,
          radius:
            mockOrganisation.radius === null ? 0 : mockOrganisation.radius,
          beschreibung: mockOrganisation.beschreibung,
        },
      ]);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <Header title={t("organisation.overview.title")} />
      <div className="body">
        <h5 style={{ marginTop: 30 }}>{t("organisation.overview.title")}</h5>
        <div>
          {organisationen.length > 0 &&
            organisationen.map((user) => (
              <Card
                key={user.id}
                className="custom-card"
                onClick={() => navigateToDetail(user)}
                style={{ marginBottom: 10 }}
              >
                <CardHeader className="custom-cardheader--default">
                  <IoPersonOutline size={27} style={{ marginRight: 15 }} />
                  <div className="custom-cardheader_text">{user.name}</div>
                </CardHeader>
                <CardBody>
                  <Card.Text>
                    {user.strasse} {user.hausnummer}
                    {user.plz && user.ort && (
                      <>
                        , {user.plz} {user.ort}
                        <br />
                      </>
                    )}
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
