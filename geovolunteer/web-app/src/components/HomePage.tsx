import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";
import { t } from "i18next";

export default function HomePage() {
  return (
    <>
      <Header title={t("home.title")} />
      <div className="body">
        <p>Startseite</p>
      </div>
      <Footer />
    </>
  );
}
