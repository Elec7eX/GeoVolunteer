import { t } from "i18next";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";

export default function Map() {
  return (
    <>
      <Header title={t("title.map.overview")} />
      <div className="body">MAP</div>
      <Footer />
    </>
  );
}
