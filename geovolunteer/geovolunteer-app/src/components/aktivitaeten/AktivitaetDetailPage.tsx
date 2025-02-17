import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Card } from "react-bootstrap";

export default function AktivitaetDetailPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header
        title={t("aktivitaeten.detail.title")}
        breadcrumb={{
          previous: t("aktivitaeten.overview.title"),
          current: t("aktivitaeten.detail.title"),
          navigate: navigate("/aktivitäten"),
        }}
      />
      <div className="body">
        <Card>
          Detail
        </Card>
      </div>
      <Footer />
    </>
  );
}
