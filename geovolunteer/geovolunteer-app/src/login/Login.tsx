import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Form as FormikForm, Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { Registration } from "./Registration";
import userService from "../services/UserServices";

export type LoginType = {
  username?: string;
  password?: string;
};

interface FormularResult {
  values: LoginType;
  formikBag: FormikHelpers<LoginType>;
}

export function Login() {
  const { t } = useTranslation();
  const { login }: any = useAuth();
  const [initialValues, setInitialValues] = useState<LoginType>();
  const [isRegistrationPage, setIsRegistrationPage] = useState<boolean>(false);

  useEffect(() => {
    setInitialValues({
      username: "",
      password: "",
    });
  }, []);

  const loogg = async (username: string, password: string) => {
    try {
      await userService.login({ username, password }).then(() => {
        login({ username, password });
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Handle error appropriately
    }
  };

  const handleSubmit = async (result: FormularResult) => {
    const { username, password } = result.values;
    if (username !== undefined && password !== undefined) {
      loogg(username, password).then((data: any) => {
        console.log(data);
      });
    }
  };

  function validationLogin(): Yup.ObjectSchema<any> {
    let shape = Yup.object().shape({
      // email: Yup.string().required("Required"),
      username: Yup.string()
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
        <div className="login">
          <h1>{t("home.title")}</h1>
          {!isRegistrationPage && (
            <Formik
              initialValues={initialValues}
              onSubmit={(values, formikBag) =>
                handleSubmit({ values, formikBag })
              }
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
                  <Form.Group className="mb-3">
                    <Form.Label>{t("label.login.benutzername")}</Form.Label>
                    <Form.Control
                      id="username"
                      placeholder={t("placeholder.login.benutzername")}
                      type="text"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.username && touched.username
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
                      placeholder={t("placeholder.login.passwort")}
                      type="password"
                      value={values.password}
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
                        id="save"
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {t("button.login")}
                      </Button>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <Button
                        className="shadow"
                        id="neuAnmelden"
                        variant="dark"
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setIsRegistrationPage(true)}
                      >
                        {t("button.anmelden")}
                      </Button>
                    </Row>
                  </Col>
                </FormikForm>
              )}
            </Formik>
          )}
          {isRegistrationPage && (
            <Registration handleBack={() => setIsRegistrationPage(false)} />
          )}
        </div>
      )}
    </>
  );
}
