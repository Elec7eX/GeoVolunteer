import { init, t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, Form } from "react-bootstrap";
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

interface FormularResult {
  values: AktivitaetModel;
  formikBag: FormikHelpers<AktivitaetModel>;
}

export default function AktivitaetDetail() {
  const [initialValues, setInitialValues] = useState<AktivitaetModel>();
  const [position, setPosition]: any = useState(null);
  const [address, setAddress] = useState("");

  const [strasse, setStrasse] = useState<string>();
  const [hausnummer, setHausnummer] = useState<string>();
  const [plz, setPlz] = useState<string>();
  const [ort, setOrt] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<Date>();

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
      marker: {
        latitude: 0,
        longitude: 0,
      },
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
          <Header title={t("aktivitaeten.create.title")} />
          <div className="body">
            <Card style={{ height: "100%" }}>
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
                    <Form.Group className="mb-3">
                      <Form.Label>{t("aktivitaeten.detail.name")}</Form.Label>
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
                          checked={values.addressInput === AdressInputEnum.Map}
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
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.adress.hausnummer")}
                          </Form.Label>
                          <Form.Control
                            id="hausnummer"
                            type="text"
                            value={hausnummer}
                            onChange={(e) => setHausnummer(e.target.value)}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Form.Group className="mb-3" style={{flex: 1, marginRight: '10px'}}>
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
                        <Form.Group className="mb-3" style={{flex: 1}}>
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
                        </div>
                      </>
                    )}
                    {values.addressInput === AdressInputEnum.Map && (
                      <>
                        <MapContainer
                          center={[48.30639, 14.28611]}
                          zoom={13}
                          style={{ height: "512px", width: "100%" }}
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
                        <Form.Group>
                          <Form.Text>
                            {address && <div>Address: {address}</div>}
                          </Form.Text>
                        </Form.Group>
                      </>
                    )}
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control type="date" />
                      <Form.Control type="time" />
                    </Form.Group>
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
