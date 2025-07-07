import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Form as FormikForm, Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { UserModel } from "../types/Types";
import userService from "../services/UserServices";
import { UserType } from "../enums/Enums";

interface Props {
  handleBack: () => void;
}

interface FormularResult {
  values: UserModel;
  formikBag: FormikHelpers<UserModel>;
}

export function Registration(props: Props) {
  const { handleBack } = props;
  const { t } = useTranslation();
  const { _login }: any = useAuth();
  const [initialValues, setInitialValues] = useState<UserModel>();
  const rollenOptionen = [
    { value: "ADMIN", label: "Admin" },
    { value: "ORGANISATION", label: "Organisation" },
    { value: "FREIWILLIGE", label: "Freiwillige" },
  ];

  useEffect(() => {
    setInitialValues({
      rolle: "ADMIN",
      login: "",
      email: "",
      password: "",
    });
  }, []);

  const handleSubmit = async (result: FormularResult) => {
    userService.create(result.values).then(async (response) => {
      await _login(response.data);
    });
  };

  function validationLogin(): Yup.ObjectSchema<any> {
    let shape = Yup.object().shape({
      email: Yup.string().required("Required"),
      login: Yup.string()
        .required("required")
        .min(2, "Too Short!")
        .max(50, "Too Long!"),
      password: Yup.string().required("Required"),
    }) as any;
    return shape;
  }

  return (
    <>
      {initialValues && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, formikBag) => handleSubmit({ values, formikBag })}
          enableReinitialize
          validationSchema={validationLogin}
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
              <Row>
                <Col md={values.rolle === UserType.FREIWILLIGE ? 6 : 12}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("label.login.rolle")}</Form.Label>
                    <Form.Select
                      id="rolle"
                      name="rolle"
                      onChange={handleChange}
                    >
                      {rollenOptionen.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {values.rolle === UserType.FREIWILLIGE && (
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>{t("profil.vorname")}</Form.Label>
                      <Form.Control
                        id="vorname"
                        name="vorname"
                        placeholder={t("placeholder.login.login")}
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.vorname && touched.vorname
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      <Form.Text className="text-muted"></Form.Text>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>{t("profil.nachname")}</Form.Label>
                      <Form.Control
                        id="nachname"
                        name="nachname"
                        placeholder={t("placeholder.login.login")}
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.nachname && touched.nachname
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      <Form.Text className="text-muted"></Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              )}
              <Form.Group className="mb-3">
                <Form.Label>{t("label.login.login")}</Form.Label>
                <Form.Control
                  id="login"
                  name="login"
                  placeholder={t("placeholder.login.login")}
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.login && touched.login
                      ? "text-input error"
                      : "text-input"
                  }
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("label.login.email")}</Form.Label>
                <Form.Control
                  id="email"
                  name="email"
                  placeholder={t("placeholder.login.email")}
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? "text-input error"
                      : "text-input"
                  }
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("label.login.passwort")}</Form.Label>
                <Form.Control
                  id="password"
                  name="password"
                  placeholder={t("placeholder.login.passwort")}
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? "text-input error"
                      : "text-input"
                  }
                />
                <Form.Text className="text-muted"></Form.Text>
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Group>
              <Col>
                <Row className="mb-3">
                  <Button
                    className="shadow"
                    id="register"
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {t("button.registrieren")}
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Button
                    className="shadow"
                    id="back"
                    variant="dark"
                    type="reset"
                    disabled={isSubmitting}
                    onClick={() => handleBack()}
                  >
                    {t("button.back")}
                  </Button>
                </Row>
              </Col>
            </FormikForm>
          )}
        </Formik>
      )}
    </>
  );
}
