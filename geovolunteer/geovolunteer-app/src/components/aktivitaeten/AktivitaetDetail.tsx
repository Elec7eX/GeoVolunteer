import * as Yup from "yup";
import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  useFormikContext,
} from "formik";
import { useEffect, useState } from "react";
import { AdresseModel, AktivitaetModel } from "../../types/Types";
import { AdressInputEnum } from "../../enums/Enums";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aktivitaetService from "../../services/AktivitaetService";

interface FormularResult {
  values: AktivitaetModel;
  formikBag: FormikHelpers<AktivitaetModel>;
}

export default function AktivitaetDetail() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [initialValues, setInitialValues] = useState<AktivitaetModel>();
  const [position, setPosition]: any = useState(null);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const [ressourcePosition, setRessourcePosition]: any = useState(null);
  const [ressourceAddress, setRessourceAddress] = useState("");
  const [ressourceLatitude, setRessourceLatitude] = useState<number>(0);
  const [ressourceLongitude, setRessourceLongitude] = useState<number>(0);

  useEffect(() => {
    const model: AktivitaetModel = {
      name: "",
      beschreibung: "",
      addresseInput: AdressInputEnum.Manual,
      adresse: {
        strasse: "",
        hausnummer: "",
        plz: "",
        ort: "",
      },
      koordinaten: {
        latitude: 0,
        longitude: 0,
      },
      teilnehmeranzahl: 0,
      transport: "",
      verpflegung: "",
      vorname: "",
      nachname: "",
      email: "",
      telefon: "",
      ressource: {
        name: "",
        beschreibung: "",
        addresseInput: AdressInputEnum.Manual,
        adresse: {
          strasse: "",
          hausnummer: "",
          plz: "",
          ort: "",
        },
        koordinaten: {
          latitude: 0,
          longitude: 0,
        },
        materialien: "",
        sicherheitsanforderungen: "",
        anmerkung: "",
        vorname: "",
        nachname: "",
        email: "",
        telefon: "",
      },
      startDatum: "",
      endDatum: "",
      startZeit: "",
      endZeit: "",
    };
    setInitialValues(model);
  }, []);

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
            setFieldValue("adresse.strasse", data.address.road);
            setFieldValue("adresse.hausnummer", data.address.house_number);
            setFieldValue("adresse.plz", data.address.postcode);
            setFieldValue("adresse.ort", data.address.city);
            setLatitude(data.lat);
            setLongitude(data.lon);
          }
        }
      },
    });

    return null;
  };

  const MapClickHandlerRessource = () => {
    const { setFieldValue } = useFormikContext();

    useMapEvents({
      click: async (event: any) => {
        const { lat, lng } = event.latlng;
        setRessourcePosition([lat, lng]);

        // Fetch address using Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        if (data && data.display_name) {
          setRessourceAddress(data.display_name);
          if (data.address) {
            setFieldValue("ressource.adresse.strasse", data.address.road);
            setFieldValue(
              "ressource.adresse.hausnummer",
              data.address.house_number
            );
            setFieldValue("ressource.adresse.plz", data.address.postcode);
            setFieldValue("ressource.adresse.ort", data.address.city);
            setRessourceLatitude(data.lat);
            setRessourceLongitude(data.lon);
          }
        }
      },
    });

    return null;
  };

  const getCoordinatesBySetter = async (
    adresse: AdresseModel,
    setLatitudeFunc: (lat: number) => void,
    setLongitudeFunc: (lon: number) => void
  ) => {
    if (
      adresse.strasse !== "" &&
      adresse.hausnummer !== "" &&
      adresse.plz !== "" &&
      adresse.ort !== ""
    ) {
      const address = `${adresse.strasse} ${adresse.hausnummer}, ${adresse.plz} ${adresse.ort}`;
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
          setLatitudeFunc(lat);
          setLongitudeFunc(lon);
        } else {
          alert("Adresse nicht gefunden");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Koordinaten:", error);
      }
    } else {
      setLatitudeFunc(0);
      setLongitudeFunc(0);
    }
  };

  const getCoordinates = async (adresse: AdresseModel) => {
    await getCoordinatesBySetter(adresse, setLatitude, setLongitude);
  };

  const getRessourceCoordinates = async (adresse: AdresseModel) => {
    await getCoordinatesBySetter(
      adresse,
      setRessourceLatitude,
      setRessourceLongitude
    );
  };

  function validationFirstPage(): Yup.ObjectSchema<AktivitaetModel> {
    let shape = Yup.object().shape({
      name: Yup.string().required("required"),
      beschreibung: Yup.string().required("Required"),
      adresse: Yup.object().shape({
        strasse: Yup.string().required("Strasse is required"),
        hausnummer: Yup.string().required("Hausnummer is required"),
        plz: Yup.string().required("PLZ is required"),
        ort: Yup.string().required("Ort is required"),
      }),
      koordinaten: Yup.object().shape({
        latitude: Yup.number().required("Latitude is required"),
        longitude: Yup.number().required("Longitude is required"),
      }),
    }) as any;
    return shape;
  }

  const handleSubmit = async (result: FormularResult) => {
    console.log(result.values);
    await aktivitaetService.create(result.values).then(() => {
      console.log("SUCCESS");
    });
  };

  return (
    <>
      {initialValues && (
        <>
          <Header
            title={
              currentPage === 0
                ? t("aktivitaeten.create.title")
                : t("ressourcen.create.title")
            }
          />
          <div className="body">
            <Card style={{ height: "auto" }}>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, formikBag) =>
                  handleSubmit({ values, formikBag })
                }
                enableReinitialize
                validationSchema={validationFirstPage}
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
                    {currentPage === 0 && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.name")}
                          </Form.Label>
                          <Form.Control
                            id="name"
                            name="name"
                            className={
                              errors.name && touched.name
                                ? "text-input error"
                                : "text-input"
                            }
                            type="text"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.beschreibung")}
                          </Form.Label>
                          <Form.Control
                            id="beschreibung"
                            name="beschreibung"
                            className={
                              errors.beschreibung && touched.beschreibung
                                ? "text-input error"
                                : "text-input"
                            }
                            type="text"
                            value={values.beschreibung}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
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
                                    name="adresse.strasse"
                                    className={
                                      errors.adresse?.strasse &&
                                      touched.adresse?.strasse
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.adresse.strasse}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="adresse.hausnummer"
                                    className={
                                      errors.adresse?.hausnummer &&
                                      touched.adresse?.hausnummer
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.adresse.hausnummer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="adresse.plz"
                                    className={
                                      errors.adresse?.plz &&
                                      touched.adresse?.plz
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.adresse.plz}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="adresse.ort"
                                    className={
                                      errors.adresse?.ort &&
                                      touched.adresse?.ort
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.adresse.ort}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    name="koordinaten.latitude"
                                    type="number"
                                    disabled
                                    value={latitude}
                                    onChange={handleChange}
                                  />
                                </Col>
                                <Col sm={6}>
                                  <Form.Control
                                    id="longitude"
                                    name="koordinaten.longitude"
                                    type="number"
                                    disabled
                                    value={longitude}
                                    onChange={handleChange}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                            <Row>
                              <Col style={{ textAlign: "right" }}>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getCoordinates(values.adresse);
                                  }}
                                >
                                  {t("button.coordinates")}
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                        {values.addresseInput === AdressInputEnum.Map && (
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
                        <Row>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.startDate")}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                id="startDatum"
                                name="startDatum"
                                className={
                                  errors.startDatum && touched.startDatum
                                    ? "text-input error"
                                    : "text-input"
                                }
                                value={values.startDatum}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.endDate")}
                              </Form.Label>
                              <Form.Control
                                id="endDatum"
                                name="endDatum"
                                type="date"
                                className={
                                  errors.endDatum && touched.endDatum
                                    ? "text-input error"
                                    : "text-input"
                                }
                                value={values.endDatum}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.startTime")}
                              </Form.Label>
                              <Form.Control
                                id="startZeit"
                                name="startZeit"
                                type="time"
                                className={
                                  errors.startZeit && touched.startZeit
                                    ? "text-input error"
                                    : "text-input"
                                }
                                value={values.startZeit}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.endTime")}
                              </Form.Label>
                              <Form.Control
                                id="endZeit"
                                name="endZeit"
                                type="time"
                                className={
                                  errors.endZeit && touched.endZeit
                                    ? "text-input error"
                                    : "text-input"
                                }
                                value={values.endZeit}
                                onChange={handleChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.teilnehmerzahl")}
                          </Form.Label>
                          <Form.Control
                            id="teilnehmeranzahl"
                            name="teilnehmeranzahl"
                            type="number"
                            value={values.teilnehmeranzahl}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.transport")}
                          </Form.Label>
                          <Form.Control
                            id="transport"
                            name="transport"
                            type="text"
                            value={values.transport}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.verpflegung")}
                          </Form.Label>
                          <Form.Control
                            id="verpflegung"
                            name="verpflegung"
                            type="text"
                            value={values.verpflegung}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <hr />
                        <h5 style={{ marginTop: 30 }}>Kontakt Informationen</h5>
                        <Row>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.kontakt.vorname")}
                              </Form.Label>
                              <Form.Control
                                id="vorname"
                                name="vorname"
                                type="text"
                                value={values.vorname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.kontakt.nachname")}
                              </Form.Label>
                              <Form.Control
                                id="nachname"
                                name="nachname"
                                type="text"
                                value={values.nachname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.kontakt.email")}
                          </Form.Label>
                          <Form.Control
                            id="email"
                            name="email"
                            type="text"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.kontakt.telefon")}
                          </Form.Label>
                          <Form.Control
                            id="telefon"
                            name="telefon"
                            type="text"
                            value={values.telefon}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </>
                    )}
                    {currentPage === 1 && (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>{t("ressourcen.detail.name")}</Form.Label>
                          <Form.Control
                            id="ressourcename"
                            name="ressource.name"
                            className={
                              errors.ressource?.name && touched.ressource?.name
                                ? "text-input error"
                                : "text-input"
                            }
                            type="text"
                            value={values.ressource.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("ressourcen.detail.beschreibung")}
                          </Form.Label>
                          <Form.Control
                            id="ressourcebeschreibung"
                            name="ressource.beschreibung"
                            className={
                              errors.ressource?.beschreibung &&
                              touched.ressource?.beschreibung
                                ? "text-input error"
                                : "text-input"
                            }
                            type="text"
                            value={values.ressource.beschreibung}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <div className="mb-3">
                          <Form.Group className="d-flex align-items-center">
                            <Form.Check
                              id="ressourcemanual"
                              type="radio"
                              label={t("ressourcen.detail.adress.manual")}
                              name="addressInputMethod"
                              value={AdressInputEnum.Manual}
                              checked={
                                values.ressource.addresseInput ===
                                AdressInputEnum.Manual
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  "ressource.addresseInput",
                                  e.target.value as AdressInputEnum
                                )
                              }
                              className="me-3"
                            />
                            <Form.Check
                              id="ressourcemap"
                              type="radio"
                              label={t("ressourcen.detail.adress.map")}
                              name="addressInputMethod"
                              value={AdressInputEnum.Map}
                              checked={
                                values.ressource.addresseInput ===
                                AdressInputEnum.Map
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  "ressource.addresseInput",
                                  e.target.value as AdressInputEnum
                                )
                              }
                            />
                          </Form.Group>
                        </div>
                        {values.ressource.addresseInput ===
                          AdressInputEnum.Manual && (
                          <>
                            <Row>
                              <Col sm={9}>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    {t("ressourcen.detail.adress.strasse")}
                                  </Form.Label>
                                  <Form.Control
                                    id="ressourcestrasse"
                                    name="ressource.adresse.strasse"
                                    className={
                                      errors.ressource?.adresse?.strasse &&
                                      touched.ressource?.adresse?.strasse
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.ressource.adresse.strasse}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group className="mb-3">
                                  <Form.Label>
                                    {t("ressourcen.detail.adress.hausnummer")}
                                  </Form.Label>
                                  <Form.Control
                                    id="ressourcehausnummer"
                                    name="ressource.adresse.hausnummer"
                                    className={
                                      errors.ressource?.adresse?.hausnummer &&
                                      touched.ressource?.adresse?.hausnummer
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.ressource.adresse.hausnummer}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                                    {t("ressourcen.detail.adress.plz")}
                                  </Form.Label>
                                  <Form.Control
                                    id="ressourceplz"
                                    name="ressource.adresse.plz"
                                    className={
                                      errors.ressource?.adresse?.plz &&
                                      touched.ressource?.adresse?.plz
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.ressource.adresse.plz}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  style={{ flex: 1 }}
                                >
                                  <Form.Label>
                                    {t("ressourcen.detail.adress.ort")}
                                  </Form.Label>
                                  <Form.Control
                                    id="ressourceort"
                                    name="ressource.adresse.ort"
                                    className={
                                      errors.ressource?.adresse?.ort &&
                                      touched.ressource?.adresse?.ort
                                        ? "text-input error"
                                        : "text-input"
                                    }
                                    type="text"
                                    value={values.ressource.adresse.ort}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col style={{ textAlign: "right" }}>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setFieldValue(
                                      "ressource.adresse.strasse",
                                      values.adresse.strasse
                                    );
                                    setFieldValue(
                                      "ressource.adresse.hausnummer",
                                      values.adresse.hausnummer
                                    );
                                    setFieldValue(
                                      "ressource.adresse.plz",
                                      values.adresse.plz
                                    );
                                    setFieldValue(
                                      "ressource.adresse.ort",
                                      values.adresse.ort
                                    );
                                    setRessourceLatitude(latitude);
                                    setRessourceLongitude(longitude);
                                  }}
                                >
                                  {t("button.aktivitaeten.adresse")}
                                </Button>
                              </Col>
                            </Row>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("ressourcen.detail.koordinaten")}
                              </Form.Label>
                              <Row>
                                <Col sm={6}>
                                  <Form.Control
                                    id="latitude"
                                    name="ressource.koordinaten.latitude"
                                    type="text"
                                    disabled
                                    value={ressourceLatitude}
                                    onChange={handleChange}
                                  />
                                </Col>
                                <Col sm={6}>
                                  <Form.Control
                                    id="longitude"
                                    name="ressource.koordinaten.longitude"
                                    type="text"
                                    disabled
                                    value={ressourceLongitude}
                                    onChange={handleChange}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                            <Row>
                              <Col style={{ textAlign: "right" }}>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    getRessourceCoordinates(
                                      values.ressource.adresse
                                    );
                                  }}
                                >
                                  {t("button.coordinates")}
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                        {values.ressource.addresseInput ===
                          AdressInputEnum.Map && (
                          <>
                            <Form.Group className="mb-3">
                              <Form.Text>
                                {ressourceAddress && (
                                  <div>Address: {ressourceAddress}</div>
                                )}
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
                              <MapClickHandlerRessource />
                              {ressourcePosition && (
                                <Marker
                                  position={ressourcePosition}
                                  icon={customIcon}
                                >
                                  <Popup>{ressourceAddress}</Popup>
                                </Marker>
                              )}
                            </MapContainer>
                          </>
                        )}
                        <Row>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              {t("ressourcen.detail.materialien")}
                            </Form.Label>
                            <Form.Control
                              id="materialien"
                              name="ressource.materialien"
                              type="text"
                              value={values.ressource.materialien}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Form.Group>
                        </Row>
                        <Row>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              {t("ressourcen.detail.sicherheitsanforderungen")}
                            </Form.Label>
                            <Form.Control
                              id="sicherheitsanforderungen"
                              name="ressource.sicherheitsanforderungen"
                              type="text"
                              value={values.ressource.sicherheitsanforderungen}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Form.Group>
                        </Row>
                        <Row>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              {t("ressourcen.detail.anmerkung")}
                            </Form.Label>
                            <Form.Control
                              id="anmerkung"
                              name="ressource.anmerkung"
                              type="text"
                              value={values.ressource.anmerkung}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </Form.Group>
                        </Row>
                        <hr />
                        <h5 style={{ marginTop: 30 }}>Kontakt Informationen</h5>
                        <Row>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.kontakt.vorname")}
                              </Form.Label>
                              <Form.Control
                                id="ressourcevorname"
                                name="ressource.vorname"
                                type="text"
                                value={values.ressource.vorname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.kontakt.nachname")}
                              </Form.Label>
                              <Form.Control
                                id="ressourcenachname"
                                name="ressource.nachname"
                                type="text"
                                value={values.ressource.nachname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.kontakt.email")}
                          </Form.Label>
                          <Form.Control
                            id="ressourceemail"
                            name="ressource.email"
                            type="text"
                            value={values.ressource.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.kontakt.telefon")}
                          </Form.Label>
                          <Form.Control
                            id="ressourcetelefon"
                            name="ressource.telefon"
                            type="text"
                            value={values.ressource.telefon}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </>
                    )}
                    {currentPage === 1 && (
                      <Col className="mb-4" style={{ textAlign: "right" }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setFieldValue("ressource.vorname", values.vorname);
                            setFieldValue(
                              "ressource.nachname",
                              values.nachname
                            );
                            setFieldValue("ressource.email", values.email);
                            setFieldValue("ressource.telefon", values.telefon);
                          }}
                        >
                          {t("button.aktivitaeten.adresse")}
                        </Button>
                      </Col>
                    )}
                    {currentPage === 2 && (
                      <>
                        <h4>{t("aktivitaeten.detail.title")}</h4>
                        <div className="mb-3 mt-4">
                          <div>
                            {t("aktivitaeten.detail.name")}: {values.name}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.beschreibung")}:{" "}
                            {values.beschreibung}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.adress.strasse")}:{" "}
                            {values.adresse.strasse}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.adress.hausnummer")}:{" "}
                            {values.adresse.hausnummer}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.adress.plz")}:{" "}
                            {values.adresse.plz}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.adress.ort")}:{" "}
                            {values.adresse.ort}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.koordinaten")}: Latitude '
                            {latitude}', Longitude '{longitude}'
                          </div>
                          <div>
                            {t("aktivitaeten.detail.startDate")}:{" "}
                            {values.startDatum}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.endDate")}:{" "}
                            {values.endDatum}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.startTime")}:{" "}
                            {values.startZeit}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.endTime")}: {values.endZeit}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.teilnehmerzahl")}:{" "}
                            {values.teilnehmeranzahl}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.transport")}:{" "}
                            {values.transport}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.verpflegung")}:{" "}
                            {values.verpflegung}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.kontakt.vorname")}:{" "}
                            {values.vorname}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.kontakt.nachname")}:{" "}
                            {values.nachname}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.kontakt.email")}:{" "}
                            {values.email}
                          </div>
                          <div>
                            {t("aktivitaeten.detail.kontakt.telefon")}:{" "}
                            {values.telefon}
                          </div>
                        </div>
                        <hr />
                        <h4>{t("ressourcen.detail.uebersicht")}</h4>
                        <div className="mb-3 mt-4">
                          <div>
                            {t("ressourcen.detail.name")}:{" "}
                            {values.ressource.name}
                          </div>
                          <div>
                            {t("ressourcen.detail.beschreibung")}:{" "}
                            {values.ressource.beschreibung}
                          </div>
                          <div>
                            {t("ressourcen.detail.adress.strasse")}:{" "}
                            {values.ressource.adresse.strasse}
                          </div>
                          <div>
                            {t("ressourcen.detail.adress.hausnummer")}:{" "}
                            {values.ressource.adresse.hausnummer}
                          </div>
                          <div>
                            {t("ressourcen.detail.adress.plz")}:{" "}
                            {values.ressource.adresse.plz}
                          </div>
                          <div>
                            {t("ressourcen.detail.adress.ort")}:{" "}
                            {values.ressource.adresse.ort}
                          </div>
                          <div>
                            {t("ressourcen.detail.koordinaten")}: Latitude '
                            {ressourceLatitude}', Longitude '
                            {ressourceLongitude}'
                          </div>
                          <div>
                            {t("ressourcen.detail.materialien")}:{" "}
                            {values.ressource.materialien}
                          </div>
                          <div>
                            {t("ressourcen.detail.sicherheitsanforderungen")}:{" "}
                            {values.ressource.sicherheitsanforderungen}
                          </div>
                          <div>
                            {t("ressourcen.detail.anmerkung")}:{" "}
                            {values.ressource.anmerkung}
                          </div>
                        </div>
                      </>
                    )}
                    <Row>
                      <>{console.log(currentPage)}</>
                      <Col style={{ textAlign: "right" }}>
                        {currentPage === 0 && (
                          <Button
                            className="shadow"
                            variant="secondary"
                            onClick={() => navigate("/aktivitäten")}
                          >
                            {t("button.cancel")}
                          </Button>
                        )}
                        {(currentPage === 1 || currentPage === 2) && (
                          <Button
                            className="shadow"
                            variant="secondary"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            {t("button.back")}
                          </Button>
                        )}
                      </Col>
                      <Col>
                        {(currentPage === 0 || currentPage === 1) && (
                          <Button
                            className="shadow"
                            variant="primary"
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            {t("button.next")}
                          </Button>
                        )}
                        {currentPage === 2 && (
                          <Button
                            type="submit"
                            className="shadow"
                            variant="primary"
                          >
                            {t("button.save")}
                          </Button>
                        )}
                      </Col>
                    </Row>
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
