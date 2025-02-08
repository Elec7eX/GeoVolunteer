import { Button } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Footer } from "./footer/Footer";
import { Header } from "./header/Header";
import { t } from "i18next";

export default function HomePage() {
  return (
    <>
      <Header title={t("title.app")}/>
      <div className="body">
        <p>
          Location analysis is closely linked to GIS. First of all, site
          analysis relies on GIS for a variety of functions from data processing
          to visualization and interpretation of site decisions. Historically,
          one of the primary motivations for the invention of GIS was to support
          site selection and site analysis in a computerized system. Secondly,
          from a broader perspective, site modeling and GIS are both part of
          spatial decision support systems. GIS, with all its data management
          and analysis capabilities, ultimately requires location modeling to
          make spatial decisions. Despite their close relationship, there has
          been a disconnect between the technologies used for site modeling and
          GIS, and they have been used separately by researchers in the two
          fields. This separation between site modeling and GIS affects both
          sides. For the researcher engaged in spatial optimization, it means
          limited data and spatial support in the decision-making process. For
          the GIS user, this means limited modeling options that are restricted
          to the offerings of existing GIS packages. At this point there exists
          a framework called relational linear programming that aims to bridge
          the previously mentioned gap between location modeling and GIS. The
          framework is based on the use of the well-established relational
          algebra as a common language for spatial optimization and GIS. It
          shows that spatial optimization models can be naturally expressed as a
          series of relational tables. This approach is possible due to the
        </p>
      </div>
      <Footer />
    </>
  );
}
