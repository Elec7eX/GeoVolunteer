import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Form as FormikForm, Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";

type RegistrationType = {
  username?: string;
  email?: string;
  password?: string;
};

interface Props {
  handleBack: () => void;
}

interface FormularResult {
  values: RegistrationType;
  formikBag: FormikHelpers<RegistrationType>;
}

export function Registration(props: Props) {
  const { handleBack } = props;
  const { t } = useTranslation();
  const { login }: any = useAuth();
  const [initialValues, setInitialValues] = useState<RegistrationType>();

  useEffect(() => {
    setInitialValues({
      username: "",
      email: "",
      password: "",
    });
  }, []);

  const handleSubmit = async (result: FormularResult) => {
    const { username, email, password } = result.values;
    if (
      username === "user" &&
      password === "password" &&
      email === "user@aon.at"
    ) {
      // Replace with actual authentication logic
      await login({ username });
    } else {
      alert("Invalid username or password");
    }
  };

  function validationLogin(): Yup.ObjectSchema<any> {
    let shape = Yup.object().shape({
      email: Yup.string().required("Required"),
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
                <Form.Label>{t("label.login.email")}</Form.Label>
                <Form.Control
                  id="email"
                  placeholder={t("placeholder.login.email")}
                  type="text"
                  value={values.email}
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
