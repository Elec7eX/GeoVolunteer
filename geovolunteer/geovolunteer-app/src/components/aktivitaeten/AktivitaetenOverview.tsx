import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AktivitaetenOverview() {
  const navigate = useNavigate();
  return (
    <>
      <Header title={t("title.activitaet.overview")} />
      <div className="body">
        <h4 style={{marginTop: 30}}>Meine erstellten Aktivitäten</h4>
        <div>
          <Card onClick={() => navigate("/aktivitäten/detail")}>
            <CardHeader>Aktivitäts-Titel</CardHeader>
            <CardBody>Aktivitäts-Detail</CardBody>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
