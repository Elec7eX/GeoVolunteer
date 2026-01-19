import http from "../http-common";
import { AktivitaetenByKategorienStatistik } from "../types/Types";

const BASE_URL = "/statistik"

const getAktivitaetenByKategorien = () => {
  return http.get<AktivitaetenByKategorienStatistik[]>(
    BASE_URL + "/aktivitaetenByKategorien"
  );
};

const statistikService = {
  getAktivitaetenByKategorien
};

export default statistikService;
