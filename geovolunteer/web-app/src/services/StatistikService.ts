import http from "../http-common";
import { AktionsradiusVerlauf, AktivitaetenByKategorienStatistik, FreiwilligenAktivitaetenType, FreiwilligenDistanzType, OrganisationenDistanz, RadiusStats } from "../types/Types";

const BASE_URL = "/statistik"

const getAktivitaetenByKategorien = () => {
  return http.get<AktivitaetenByKategorienStatistik[]>(
    BASE_URL + "/aktivitaetenByKategorien"
  );
};

const getAktionsradius = () => {
  return http.get<RadiusStats>(
    BASE_URL + "/radius"
  );
};

const getAktionsradiusVerlauf = () => {
  return http.get<AktionsradiusVerlauf[]>(
    BASE_URL + "/radius/verlauf"
  );
};

const getOrganisationenDistanz = () => {
  return http.get<OrganisationenDistanz>(
    BASE_URL + "/organisationen/distanz"
  );
};

const getFreiwilligenDistanz = () => {
  return http.get<FreiwilligenDistanzType>(
    BASE_URL + "/organisation/freiwilligenDistanz"
  );
};

const getFreiwilligenAktivitaetenDistanz = () => {
  return http.get<FreiwilligenAktivitaetenType>(
    BASE_URL + "/organisation/freiwilligenAktivitaetenDistanz"
  );
};

const statistikService = {
  getAktivitaetenByKategorien,
  getAktionsradius,
  getAktionsradiusVerlauf,
  getOrganisationenDistanz,
  getFreiwilligenDistanz,
  getFreiwilligenAktivitaetenDistanz
};

export default statistikService;
