import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";

export default function Organisaiton() {
  return (
    <>
      <Header title={t("organisation.overview.title")} />
      <div className="body">Organisation</div>
      <Footer />
    </>
  );
}
