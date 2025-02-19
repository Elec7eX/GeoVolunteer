import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsHeartPulse } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";

export default function AktivitaetenOverview() {
  const navigate = useNavigate();

  const navigateToDetail = () => {
    return navigate("/aktivitäten/detail");
  };

  return (
    <>
      <Header title={t("aktivitaeten.overview.title")} />
      <div className="body">
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.created.title")}
        </h5>
        <div>
          <Card onClick={navigateToDetail}>
            <CardHeader>
              <BsHeartPulse style={{ marginRight: 5 }} />
              Aktivitäts-Titel
            </CardHeader>
            <CardBody>
              <Card.Text>Aktivitäts-Detail</Card.Text>
            </CardBody>
          </Card>
          <Card style={{ marginTop: 10 }}>
            <CardHeader>
              <BsHeartPulse style={{ marginRight: 5 }} />
              Second Card
            </CardHeader>
            <CardBody>
              <Card.Text>Second Card Body</Card.Text>
            </CardBody>
          </Card>
        </div>
        <hr />
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.done.title")}
        </h5>
        <div>
          <Card onClick={navigateToDetail}>
            <CardHeader>
              <BsHeartPulse style={{ marginRight: 5 }} />
              Aktivitäts-Titel
            </CardHeader>
            <CardBody>
              <Card.Text>Aktivitäts-Detail</Card.Text>
            </CardBody>
          </Card>
          <Card style={{ marginTop: 10 }}>
            <CardHeader>
              <BsHeartPulse style={{ marginRight: 5 }} />
              Second Card
            </CardHeader>
            <CardBody>
              <Card.Text>Second Card Body</Card.Text>
            </CardBody>
          </Card>
        </div>
      </div>
      <Footer displayAddAktivitaet/>
    </>
  );
}
