import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";

export default function Organisaiton() {
  return (
    <>
      <Header title={t("title.organisation.overview")} />
      <div className="body">Organisation</div>
      <Footer />
    </>
  );
}
