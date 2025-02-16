import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BsHeartPulse } from "react-icons/bs";

export default function AktivitaetenOverview() {
  const navigate = useNavigate();

  const navigateToDetail = () =>{
    return navigate("/aktivitäten/detail");
  } 

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
              <BsHeartPulse style={{marginRight: 5}}/>
              Aktivitäts-Titel
            </CardHeader>
            <CardBody>Aktivitäts-Detail</CardBody>
          </Card>
          <Card style={{ marginTop: 10 }}>
            <CardHeader>Second Card</CardHeader>
            <CardBody>Second Card Body</CardBody>
          </Card>
        </div>
        <hr />
        <h5 style={{ marginTop: 30 }}>
          {t("aktivitaeten.overview.done.title")}
        </h5>
        <div>
          <Card onClick={navigateToDetail}>
            <CardHeader>Aktivitäts-Titel</CardHeader>
            <CardBody>Aktivitäts-Detail</CardBody>
          </Card>
          <Card style={{ marginTop: 10 }}>
            <CardHeader>Second Card</CardHeader>
            <CardBody>Second Card Body</CardBody>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
