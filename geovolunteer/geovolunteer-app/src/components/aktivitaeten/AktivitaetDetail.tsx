import * as Yup from "yup";
import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  FormikValues,
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

  useEffect(() => {
    const model: AktivitaetModel = {
      name: "",
      beschreibung: "",
      addressInput: AdressInputEnum.Manual,
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

  // Custom hook to handle map click events
  const MapClickHandler = () => {
    const formikContext = useFormikContext();

    if (!formikContext) {
      console.error("MapClickHandler must be used within a Formik context.");
    }

    const { setFieldValue } = formikContext;
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

  const getCoordinates = async (adresse: AdresseModel) => {
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

  function validationFirstPage(): Yup.ObjectSchema<AktivitaetModel> {
    let shape = Yup.object().shape({
      name: Yup.string().required("required"),
      beschreibung: Yup.string().required("Required"),
      adresse: Yup.object().shape({
        strasse: Yup.string().required("Strasse is required"), // Add a message for clarity
        hausnummer: Yup.string().required("Hausnummer is required"),
        plz: Yup.string().required("PLZ is required"),
        ort: Yup.string().required("Ort is required"),
      }),
      koordinaten: Yup.object().shape({
        latitude: Yup.number().required("Latitude is required"), // Correct spelling if needed
        longitude: Yup.number().required("Longitude is required"),
      }),
    }) as any;
    return shape;
  }

  const handleSubmit = async (result: FormularResult) => {
    console.log("Submit clicked!!!");
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
                              errors.name && touched.name
                                ? "text-input error"
                                : "text-input"
                            }
                            type="text"
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
                              value={AdressInputEnum.Manual} // Use enum value here
                              checked={
                                values.addressInput === AdressInputEnum.Manual
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  "addressInput",
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
                              value={AdressInputEnum.Map} // Use enum value here
                              checked={
                                values.addressInput === AdressInputEnum.Map
                              }
                              onChange={(e) =>
                                setFieldValue(
                                  "addressInput",
                                  e.target.value as AdressInputEnum
                                )
                              }
                            />
                          </Form.Group>
                        </div>
                        {values.addressInput === AdressInputEnum.Manual && (
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
                                      errors.name && touched.name
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
                                      errors.name && touched.name
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
                                      errors.name && touched.name
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
                                      errors.name && touched.name
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
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.koordinaten")}
                              </Form.Label>
                              <Row>
                                <Col sm={6}>
                                  <Form.Control
                                    id="latitude"
                                    name="koordinaten.latitude"
                                    type="text"
                                    disabled
                                    value={latitude}
                                    onChange={handleChange}
                                  />
                                </Col>
                                <Col sm={6}>
                                  <Form.Control
                                    id="longitude"
                                    name="koordinaten.longitude"
                                    type="text"
                                    disabled
                                    value={longitude}
                                    onChange={handleChange}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </>
                        )}
                        {values.addressInput === AdressInputEnum.Map && (
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
                              {/* Use the custom hook for handling clicks */}
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
                                  errors.name && touched.name
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
                                  errors.name && touched.name
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
                                  errors.name && touched.name
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
                                  errors.name && touched.name
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
                            id="teilnehmerzahl"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.kontakt.transport")}
                          </Form.Label>
                          <Form.Control
                            id="transport"
                            type="text"
                            value={values.transport}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.kontakt.verpflegung")}
                          </Form.Label>
                          <Form.Control
                            id="verpflegung"
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
                            type="text"
                            value={values.telefon}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </>
                    )}
                    {currentPage === 1 && <></>}
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
