import { init, t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  FormikValues,
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

  const [strasse, setStrasse] = useState<string>();
  const [hausnummer, setHausnummer] = useState<string>();
  const [plz, setPlz] = useState<string>();
  const [ort, setOrt] = useState<string>();
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [endDate, setEndDate] = useState(new Date().toString());
  const [startTime, setStartTime] = useState(new Date().toString());
  const [endTime, setEndTime] = useState(new Date().toString());

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
      ressource: {
        name: "",
      },
    };
    setInitialValues(model);
  }, []);

  const customIcon = new Icon({
    iconUrl: require("../../icons/marker-icon.png"),
    iconSize: [38, 38],
  });

  // Custom hook to handle map click events
  const MapClickHandler = () => {
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
            setStrasse(data.address.road);
            setHausnummer(data.address.house_number);
            setPlz(data.address.postcode);
            setOrt(data.address.city);
            setLatitude(data.lat);
            setLongitude(data.lon);
          }
        }
      },
    });

    return null; // This component doesn't render anything
  };

  const handleSubmit = async (result: FormularResult) => {};

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
                validationSchema={currentPage === 0 ? undefined : undefined}
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
                                    type="text"
                                    value={strasse}
                                    onChange={(e) => setStrasse(e.target.value)}
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
                                    type="text"
                                    value={hausnummer}
                                    onChange={(e) =>
                                      setHausnummer(e.target.value)
                                    }
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
                                    type="text"
                                    value={plz}
                                    onChange={(e) => setPlz(e.target.value)}
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
                                    type="text"
                                    value={ort}
                                    onChange={(e) => setOrt(e.target.value)}
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
                                    type="text"
                                    disabled
                                    value={latitude}
                                  />
                                </Col>
                                <Col sm={6}>
                                  <Form.Control
                                    id="longitude"
                                    type="text"
                                    disabled
                                    value={longitude}
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
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value!)}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.endDate")}
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value!)}
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
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value!)}
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("aktivitaeten.detail.endTime")}
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value!)}
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
                            value={values.teilnehmeranzahl}
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
                            value={values.name}
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
                            value={values.name}
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
                                value={values.name}
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
                                value={values.name}
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
                            value={values.name}
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
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </>
                    )}
                    <Row>
                      <Col style={{ textAlign: "right" }}>
                        {currentPage === 0 && (
                          <Button
                            variant="secondary"
                            onClick={() => navigate("/aktivitäten")}
                          >
                            {t("button.cancel")}
                          </Button>
                        )}
                        {currentPage === 1 && (
                          <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            {t("button.zurueck")}
                          </Button>
                        )}
                      </Col>
                      <Col>
                        <Button
                          variant="primary"
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          {t("button.weiter")}
                        </Button>
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
