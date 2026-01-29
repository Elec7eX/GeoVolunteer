import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Form as FormikForm, Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { Registration } from "./Registration";
import userService from "../services/UserServices";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { mockUser } from "../mockData/userMock";

export type LoginType = {
  login?: string;
  password?: string;
};

interface FormularResult {
  values: LoginType;
  formikBag: FormikHelpers<LoginType>;
}

export function Login() {
  const { t } = useTranslation();
  const { _login }: any = useAuth();
  const [initialValues, setInitialValues] = useState<LoginType>();
  const [isRegistrationPage, setIsRegistrationPage] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setInitialValues({
      login: "",
      password: "",
    });
  }, []);

  const handleSubmit = async (result: FormularResult) => {
    const { login, password } = result.values;
    if (login !== undefined && password !== undefined) {
      await userService
        .login({ login, password })
        .then((response) => {
          _login(response.data);
        })
        .catch((error) => {
          alert("Benutzer existiert nicht!");
          _login(mockUser);
        });
    }
  };

  function validationLogin(): Yup.ObjectSchema<any> {
    let shape = Yup.object().shape({
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
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
              }) => (
                <FormikForm className="rounded p-4">
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
                    <InputGroup>
                      <Form.Control
                        id="password"
                        name="password"
                        placeholder={t("placeholder.login.passwort")}
                        type={showPassword ? "text" : "password"}
                        onChange={handleChange}
                        className={
                          errors.password && touched.password
                            ? "text-input error"
                            : "text-input"
                        }
                      />
                      <Button
                        variant="secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
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
