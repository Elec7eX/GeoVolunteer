import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, Form } from "react-bootstrap";
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  FormikValues,
} from "formik";
import { useState } from "react";

interface FormularResult {
  values: string;
  formikBag: FormikHelpers<string>;
}

export default function AktivitaetDetail() {
  const [initialValues, setInitialValues] = useState<string>("1");

  const handleSubmit = async (result: FormularResult) => {};

  return (
    <>
      {initialValues && (
        <>
          <Header title={t("aktivitaeten.create.title")} />
          <div className="body">
            <Card style={{ height: "100%" }}>
              <Formik
                initialValues={{}}
                onSubmit={() => {}}
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
                }) => (
                  <FormikForm className="rounded p-4">
                    <Form.Group className="mb-3">
                      <Form.Label>{t("aktivitaeten.detail.name")}</Form.Label>
                      <Form.Control
                        id="username"
                        type="text"
                        value={undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {t("aktivitaeten.detail.beschreibung")}
                      </Form.Label>
                      <Form.Control
                        id="username"
                        type="text"
                        value={undefined}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Group>
                    {["radio"].map((typ: any) => (
                      <div key={`inline-${typ}`} className="mb-3">
                        <Form.Check
                          inline
                          label={t("aktivitaeten.detail.adress.manual")}
                          name="group1"
                          type={typ}
                          id={`inline-${typ}-1`}
                        />
                        <Form.Check
                          inline
                          label={t("aktivitaeten.detail.adress.map")}
                          name="group1"
                          type={typ}
                          id={`inline-${typ}-2`}
                        />
                      </div>
                    ))}
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
