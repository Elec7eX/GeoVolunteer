import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AdressInputEnum, UserType } from "../../enums/Enums";
import { useEffect, useState } from "react";
import { UserModel } from "../../types/Types";
import userService from "../../services/UserServices";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Card, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  useFormikContext,
} from "formik";
import axios from "axios";
import { Icon } from "leaflet";

interface FormularResult {
  values: UserModel;
  formikBag: FormikHelpers<UserModel>;
}

export default function Profil() {
  const [user] = useLocalStorage("user", null);
  const [initialValues, setInitialValues] = useState<UserModel>();
  const [edit, setEdit] = useState<boolean>(false);
  const [position, setPosition]: any = useState(null);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user.id !== undefined) {
      userService.get(user.id).then((response) => {
        var benutzer = response.data;
        setInitialValues({
          id: benutzer.id,
          rolle: benutzer.rolle,
          login: benutzer.login,
          password: benutzer.password,
          email: benutzer.email,
          telefon: benutzer.telefon,
          addresseInput: AdressInputEnum.Manual,
          strasse: benutzer.strasse,
          hausnummer: benutzer.hausnummer,
          plz: benutzer.plz,
          ort: benutzer.ort,
          land: benutzer.land,
          name: benutzer.name,
          beschreibung: benutzer.beschreibung,
          webseite: benutzer.webseite,
          vorname: benutzer.vorname,
          nachname: benutzer.nachname,
          geburtsDatum: benutzer.geburtsDatum,
          verfuegbarVonDatum: benutzer.verfuegbarVonDatum,
          verfuegbarBisDatum: benutzer.verfuegbarBisDatum,
          verfuegbarVonZeit: benutzer.verfuegbarVonZeit,
          verfuegbarBisZeit: benutzer.verfuegbarBisZeit,
        });
        console.log(benutzer);
      });
    }
  }, [user.id]);

  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  const MapClickHandler = () => {
    const { setFieldValue } = useFormikContext();

    useMapEvents({
      click: async (event: any) => {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);

        // Fetch address using Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        if (data && data.display_name) {
          setAddress(data.display_name);
          if (data.address) {
            setFieldValue("strasse", data.address.road);
            setFieldValue("hausnummer", data.address.house_number);
            setFieldValue("plz", data.address.postcode);
            setFieldValue("ort", data.address.city);
            setLatitude(data.lat);
            setLongitude(data.lon);
          }
        }
      },
    });

    return null;
  };

  const getCoordinates = async (
    strasse: string,
    hausnummer: string,
    plz: string,
    ort: string
  ) => {
    if (strasse !== "" && hausnummer !== "" && plz !== "" && ort !== "") {
      const address = `${strasse} ${hausnummer}, ${plz} ${ort}`;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: address,
              format: "json",
              addressdetails: 1,
            },
          }
        );

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLatitude(lat);
          setLongitude(lon);
        } else {
          alert("Adresse nicht gefunden");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Koordinaten:", error);
      }
    } else {
      setLatitude(0);
      setLongitude(0);
    }
  };

  const handleSubmit = async (result: FormularResult) => {
    var benutzer: UserModel = result.values;
    userService.update(benutzer.id, benutzer).then(() => setEdit(false));
  };

  return (
    <>
      <Header title={t("profil.overview.title")} />
      {initialValues && (
        <>
          <div className="body">
            <Card style={{ height: "auto" }}>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, formikBag) =>
                  handleSubmit({ values, formikBag })
                }
                enableReinitialize
                validationSchema={undefined}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  setFieldValue,
                }) => (
                  <FormikForm className="rounded p-4">
                    <Row>
                      <Col style={{ textAlign: "right" }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setEdit(!edit);
                          }}
                        >
                          {t("button.change")}
                        </Button>
                      </Col>
                    </Row>
                    {initialValues.rolle === UserType.ORGANISATION && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("profil.name")}</Form.Label>
                          <Form.Control
                            id="name"
                            name="name"
                            type="text"
                            disabled={!edit}
                            value={values.name}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("profil.beschreibung")}</Form.Label>
                          <Form.Control
                            id="beschreibung"
                            name="beschreibung"
                            as="textarea"
                            rows={3}
                            disabled={!edit}
                            value={values.beschreibung}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("profil.webseite")}</Form.Label>
                          <Form.Control
                            id="webseite"
                            name="webseite"
                            type="text"
                            disabled={!edit}
                            value={values.webseite}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </>
                    )}
                    {initialValues.rolle === UserType.FREIWILLIGE && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("profil.vorname")}</Form.Label>
                          <Form.Control
                            id="vorname"
                            name="vorname"
                            type="text"
                            disabled={!edit}
                            value={values.vorname}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("profil.nachname")}</Form.Label>
                          <Form.Control
                            id="nachname"
                            name="nachname"
                            type="text"
                            disabled={!edit}
                            value={values.nachname}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("profil.geburtsdatum")}</Form.Label>
                          <Form.Control
                            type="date"
                            id="geburtsDatum"
                            name="geburtsDatum"
                            disabled={!edit}
                            value={values.geburtsDatum}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Row>
                          <h5>{t("profil.verfuegbar.datum")}</h5>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("profil.verfuegbar.von")}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                id="verfuegbarVonDatum"
                                name="verfuegbarVonDatum"
                                disabled={!edit}
                                value={values.verfuegbarVonDatum}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("profil.verfuegbar.bis")}
                              </Form.Label>
                              <Form.Control
                                id="verfuegbarBisDatum"
                                name="verfuegbarBisDatum"
                                disabled={!edit}
                                type="date"
                                value={values.verfuegbarBisDatum}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <h5>{t("profil.verfuegbar.zeit")}</h5>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("profil.verfuegbar.von")}
                              </Form.Label>
                              <Form.Control
                                id="verfuegbarVonZeit"
                                name="verfuegbarVonZeit"
                                disabled={!edit}
                                type="time"
                                value={values.verfuegbarVonZeit}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("profil.verfuegbar.bis")}
                              </Form.Label>
                              <Form.Control
                                id="verfuegbarBisZeit"
                                name="verfuegbarBisZeit"
                                disabled={!edit}
                                type="time"
                                value={values.verfuegbarBisZeit}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}
                    <Form.Group className="mb-3">
                      <Form.Label>{t("profil.login")}</Form.Label>
                      <Form.Control
                        id="login"
                        name="login"
                        type="text"
                        disabled={!edit}
                        value={values.login}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>{t("profil.password")}</Form.Label>
                      <InputGroup>
                        <Form.Control
                          id="password"
                          name="password"
                          disabled={!edit}
                          placeholder={t("placeholder.login.passwort")}
                          type={showPassword ? "text" : "password"}
                          onChange={handleChange}
                        />
                        <Button
                          variant="secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>{t("profil.email")}</Form.Label>
                      <Form.Control
                        id="email"
                        name="email"
                        type="email"
                        disabled={!edit}
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>{t("profil.telefon")}</Form.Label>
                      <Form.Control
                        id="telefon"
                        name="telefon"
                        type="text"
                        disabled={!edit}
                        value={values.telefon}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    {edit && (
                      <div className="mb-3">
                        <Form.Group className="d-flex align-items-center">
                          <Form.Check
                            id="manual"
                            type="radio"
                            label={t("aktivitaeten.detail.adress.manual")}
                            name="addressInputMethod"
                            value={AdressInputEnum.Manual}
                            checked={
                              values.addresseInput === AdressInputEnum.Manual
                            }
                            onChange={(e) =>
                              setFieldValue(
                                "addresseInput",
                                e.target.value as AdressInputEnum
                              )
                            }
                            className="me-3"
                          />
                          <Form.Check
                            id="map"
                            type="radio"
                            label={t("aktivitaeten.detail.adress.map")}
                            name="addressInputMethod"
                            value={AdressInputEnum.Map}
                            checked={
                              values.addresseInput === AdressInputEnum.Map
                            }
                            onChange={(e) =>
                              setFieldValue(
                                "addresseInput",
                                e.target.value as AdressInputEnum
                              )
                            }
                          />
                        </Form.Group>
                      </div>
                    )}
                    {values.addresseInput === AdressInputEnum.Manual && (
                      <>
                        <Row>
                          <Col sm={9}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.adress.strasse")}
                              </Form.Label>
                              <Form.Control
                                id="strasse"
                                name="strasse"
                                type="text"
                                disabled={!edit}
                                value={values.strasse}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.adress.hausnummer")}
                              </Form.Label>
                              <Form.Control
                                id="hausnummer"
                                name="hausnummer"
                                disabled={!edit}
                                type="text"
                                value={values.hausnummer}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={4}>
                            <Form.Group
                              className="mb-3"
                              style={{ flex: 1, marginRight: "10px" }}
                            >
                              <Form.Label>
                                {t("aktivitaeten.detail.adress.plz")}
                              </Form.Label>
                              <Form.Control
                                id="plz"
                                name="plz"
                                disabled={!edit}
                                type="text"
                                value={values.plz}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3" style={{ flex: 1 }}>
                              <Form.Label>
                                {t("aktivitaeten.detail.adress.ort")}
                              </Form.Label>
                              <Form.Control
                                id="ort"
                                name="ort"
                                disabled={!edit}
                                type="text"
                                value={values.ort}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.koordinaten")}
                          </Form.Label>
                          <Row>
                            <Col sm={6}>
                              <Form.Control
                                id="latitude"
                                name="latitude"
                                type="number"
                                disabled
                                value={latitude}
                                onChange={handleChange}
                              />
                            </Col>
                            <Col sm={6}>
                              <Form.Control
                                id="longitude"
                                name="longitude"
                                type="number"
                                disabled
                                value={longitude}
                                onChange={handleChange}
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                        {edit && (
                          <Row>
                            <Col style={{ textAlign: "right" }}>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  getCoordinates(
                                    values.strasse!,
                                    values.hausnummer!,
                                    values.plz!,
                                    values.ort!
                                  );
                                }}
                              >
                                {t("button.coordinates")}
                              </Button>
                            </Col>
                          </Row>
                        )}
                      </>
                    )}
                    {edit && values.addresseInput === AdressInputEnum.Map && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Text>
                            {address && <div>Address: {address}</div>}
                          </Form.Text>
                        </Form.Group>
                        <MapContainer
                          center={[48.30639, 14.28611]}
                          zoom={13}
                          style={{
                            height: "512px",
                            width: "100%",
                            marginBottom: "2rem",
                          }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <MapClickHandler />
                          {position && (
                            <Marker position={position} icon={customIcon}>
                              <Popup>{address}</Popup>
                            </Marker>
                          )}
                        </MapContainer>
                      </>
                    )}
                    {edit && (
                      <Button
                        type="submit"
                        className="shadow"
                        variant="primary"
                      >
                        {t("button.save")}
                      </Button>
                    )}
                  </FormikForm>
                )}
              </Formik>
            </Card>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
