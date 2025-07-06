import { t } from "i18next";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";

export default function FreiwilligeDetailPage() {
  return (
    <>
      <Header
        title={t("freiwillige.detail.title")}
        breadcrumb={{
          title: t("freiwillige.header.title"),
          navigate: "/freiwillige",
        }}
      />
      <div className="body">Freiwillige Detail Page</div>
      <Footer />
    </>
  );
}
