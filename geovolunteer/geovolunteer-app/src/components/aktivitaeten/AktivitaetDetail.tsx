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
import { AktivitaetModel } from "../../types/Types";
import { AdressInputEnum } from "../../enums/Enums";

interface FormularResult {
  values: AktivitaetModel;
  formikBag: FormikHelpers<AktivitaetModel>;
}

export default function AktivitaetDetail() {
  const [initialValues, setInitialValues] = useState<AktivitaetModel>();

  useEffect(() => {
    const model: AktivitaetModel = {
      name: "",
      beschreibung: "",
      addressInput: AdressInputEnum.Manual,
      ressource: {
        id: "",
      },
    };
    setInitialValues(model);
  }, []);

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
                            value={values.adresse?.strasse}
                            onChange={handleChange}
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
                            value={values.adresse?.hausnummer}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.adress.plz")}
                          </Form.Label>
                          <Form.Control
                            id="plz"
                            type="text"
                            value={values.adresse?.plz}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            {t("aktivitaeten.detail.adress.ort")}
                          </Form.Label>
                          <Form.Control
                            id="ort"
                            type="text"
                            value={values.adresse?.ort}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Form.Group>
                      </>
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
