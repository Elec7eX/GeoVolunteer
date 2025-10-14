import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { AdressInputEnum, UserType } from "../../enums/Enums";
import { useEffect, useRef, useState } from "react";
import { GeoJsonFeature, UserModel } from "../../types/Types";
import userService from "../../services/UserServices";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMapEvents } from "react-leaflet";
import { Card, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  useFormikContext,
  FormikErrors,
} from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MapComponent from "../karte/MapComponent";

interface FormularResult {
  values: UserModel;
  formikBag: FormikHelpers<UserModel>;
}

export default function Profil() {
  const navigate = useNavigate();
  const [user] = useLocalStorage("user", null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [initialValues, setInitialValues] = useState<UserModel>();

  const [userShape, setUserShape] = useState<GeoJsonFeature>();
  const [edit, setEdit] = useState<boolean>(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);

  const einheitOptions = [
    { value: "KM", label: "km" },
    { value: "M", label: "m" },
  ];

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
          shape: benutzer.shape,
          radius: benutzer.radius === null ? 0 : benutzer.radius,
          einheit:
            benutzer.einheit == null
              ? einheitOptions.find((e) => e.value === "M")?.value
              : benutzer.einheit,
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
        if (benutzer.shape && benutzer.shape.geometry.type === "Point") {
          setUserShape(benutzer.shape);
          const [lng, lat] = benutzer.shape.geometry.coordinates;
          setLatitude(lat);
          setLongitude(lng);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleUserShape = (
    userShape: GeoJsonFeature,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<void | FormikErrors<UserModel>>
  ) => {
    setUserShape(userShape);
    if (userShape?.properties?.data) {
      const data = userShape?.properties.data;
      if (data && data.display_name) {
        if (data.address) {
          setFieldValue("strasse", data.address.road);
          setFieldValue("hausnummer", data.address.house_number);
          setFieldValue("plz", data.address.postcode);
          setFieldValue("ort", data.address.city);
          if (userShape.geometry.type === "Point") {
            const [lng, lat] = userShape.geometry.coordinates;
            setLatitude(lat);
            setLongitude(lng);
          }
        }
      }
    } else {
      setFieldValue("strasse", null);
      setFieldValue("hausnummer", null);
      setFieldValue("plz", null);
      setFieldValue("ort", null);
      setLatitude(0);
      setLongitude(0);
    }
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
    benutzer.shape = userShape;
    userService.update(benutzer.id, benutzer).then(() => {
      setEdit(false);
      navigate("/");
    });
  };

  const isFreiwillige = (): boolean => {
    return initialValues!.rolle === UserType.FREIWILLIGE;
  };

  const isOrganisation = (): boolean => {
    return initialValues!.rolle === UserType.ORGANISATION;
  };

  const isAdmin = (): boolean => {
    return initialValues!.rolle === UserType.ADMIN;
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
                {({ values, handleChange, setFieldValue }) => (
                  <FormikForm className="rounded p-4">
                    <Row>
                      <Col style={{ textAlign: "right" }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setEdit(!edit);
                            setFieldValue(
                              "addresseInput",
                              AdressInputEnum.Manual
                            );
                          }}
                        >
                          {t("button.change")}
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h5>{t("profil.logindaten.title")}</h5>
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
                      </Col>
                    </Row>
                    {isFreiwillige() && (
                      <>
                        <Row style={{ marginTop: 40 }}>
                          <h5>{t("profil.persoenlichedaten.title")}</h5>
                          <Col sm={6}>
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
                          </Col>
                          <Col sm={6}>
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
                          </Col>
                        </Row>
                        <Row>
                          <Col sm={4}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("profil.geburtsdatum")}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                id="geburtsDatum"
                                name="geburtsDatum"
                                disabled={!edit}
                                value={values.geburtsDatum}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    )}
                    {isOrganisation() && (
                      <>
                        <h5 style={{ marginTop: 40 }}>
                          {t("profil.organisationdaten.title")}
                        </h5>
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
                      </>
                    )}
                    <Row>
                      <Col sm={8}>
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
                      </Col>
                      <Col sm={4}>
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
                      </Col>
                    </Row>
                    {isOrganisation() && (
                      <>
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
                    {!isAdmin() && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {isOrganisation() && t("profil.beschreibung")}
                            {isFreiwillige() && t("profil.beschreibung.user")}
                          </Form.Label>
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
                        <h5 style={{ marginTop: 40 }}>
                          {isFreiwillige() && t("profil.verfuegbar.ort.title")}
                          {isOrganisation() &&
                            t("profil.organisationdaten.addresse.title")}
                        </h5>
                        {edit && (
                          <div className="mb-3 mt-4">
                            <Form.Group className="d-flex align-items-center">
                              <Form.Check
                                id="manual"
                                type="radio"
                                label={t("aktivitaeten.detail.adress.manual")}
                                name="addressInputMethod"
                                value={AdressInputEnum.Manual}
                                checked={
                                  values.addresseInput ===
                                  AdressInputEnum.Manual
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
                                onChange={(e) => {
                                  setFieldValue(
                                    "addresseInput",
                                    e.target.value as AdressInputEnum
                                  );
                                  setTimeout(() => {
                                    mapRef.current?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "start",
                                    });
                                  }, 200);
                                }}
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
                                <Form.Group
                                  className="mb-3"
                                  style={{ flex: 1 }}
                                >
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
                                  <br />
                                  <br />
                                </Col>
                              </Row>
                            )}
                          </>
                        )}
                        {edit &&
                          values.addresseInput === AdressInputEnum.Map && (
                            <div ref={mapRef}>
                              {isFreiwillige() && (
                                <MapComponent
                                  editable
                                  markerWithRadiusMode
                                  radius={
                                    values.einheit === "KM"
                                      ? (values.radius || 0) * 1000
                                      : values.radius || 0
                                  }
                                  geoJsonData={userShape}
                                  onShapeChange={(geoJson) =>
                                    handleUserShape(geoJson, setFieldValue)
                                  }
                                />
                              )}
                              {isOrganisation() && (
                                <MapComponent
                                  editable
                                  drawMarkerOnly
                                  geoJsonData={userShape}
                                  onShapeChange={(geoJson) =>
                                    handleUserShape(geoJson, setFieldValue)
                                  }
                                />
                              )}
                            </div>
                          )}
                        {isFreiwillige() && (
                          <>
                            {edit && (
                              <Row>
                                <Col sm={9}>
                                  <Form.Label>
                                    {t("profil.verfuegbar.umkreis")}
                                    {values.radius}{" "}
                                    {values.einheit === "KM" ? "km" : "m"}
                                  </Form.Label>
                                  {values.addresseInput ===
                                    AdressInputEnum.Map && (
                                    <Form.Range
                                      id="radius"
                                      name="radius"
                                      min={0}
                                      max={values.einheit === "KM" ? 25 : 25000}
                                      value={values.radius}
                                      onChange={handleChange}
                                    />
                                  )}
                                </Col>
                                {values.addresseInput ===
                                  AdressInputEnum.Map && (
                                  <Col>
                                    <Form.Group className="mb-3">
                                      <Form.Label>
                                        {t("profil.verfuegbar.einheit")}
                                      </Form.Label>
                                      <Form.Select
                                        id="einheit"
                                        name="einheit"
                                        value={values.einheit}
                                        onChange={(e) => {
                                          e.preventDefault();
                                          setFieldValue(
                                            "einheit",
                                            e.target.value
                                          );
                                          setFieldValue("radius", 0);
                                        }}
                                      >
                                        {einheitOptions.map((option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        ))}
                                      </Form.Select>
                                    </Form.Group>
                                  </Col>
                                )}
                              </Row>
                            )}
                            <Row style={{ marginTop: 40 }}>
                              <h5>{t("profil.verfuegbar.title")}</h5>
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
                      </>
                    )}
                    {edit && (
                      <Row>
                        <Col style={{ textAlign: "right", marginTop: 20 }}>
                          <Button
                            type="submit"
                            className="shadow"
                            variant="primary"
                          >
                            {t("button.save")}
                          </Button>
                        </Col>
                      </Row>
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
