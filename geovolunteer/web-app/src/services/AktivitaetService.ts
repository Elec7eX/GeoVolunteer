import http from "../http-common";
import { AktivitaetModel } from "../types/Types";

const BASE_URL = "/aktivitaet"

const update = (data: AktivitaetModel) => { 
  console.log("Request-Daten:", data);
  return http.post<AktivitaetModel>(BASE_URL + "/update", data);
};

const getLaufendeAktivitaeten = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/laufendeAktivitaeten");
};

const getBevorstehendeAktivitaeten = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/bevorstehendeAktivitaeten");
};

const getLaufendeUndBevorstehendeAktivitaeten = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/laufendeUndBevorstehendeAktivitaeten");
};

const getAbgeschlosseneAktivitaeten = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/abgeschlosseneAktivitaeten");
};

const getAll = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/aktivitaeten");
};
const getAktuelleAktivitaeten = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/aktuelleAktivitaeten");
};
const getById = (id: string) => {
  return http.get<AktivitaetModel>(BASE_URL + `/${id}`);
}

const deleteById = (id: string) => {
  return http.delete(`${BASE_URL}/delete/${id}`);
};

const addTeilnehmer = (id: string) => {
  return http.put<AktivitaetModel>(BASE_URL + `/addTeilnehmer/${id}`);
}

const removeTeilnehmer = (id: string) => {
  return http.put<AktivitaetModel>(BASE_URL + `/removeTeilnehmer/${id}`);
}

const aktivitaetService = {
  update,
  getLaufendeAktivitaeten,
  getBevorstehendeAktivitaeten,
  getLaufendeUndBevorstehendeAktivitaeten,
  getAbgeschlosseneAktivitaeten,
  getAll,
  getAktuelleAktivitaeten,
  getById,
  deleteById,
  addTeilnehmer,
  removeTeilnehmer
};

export default aktivitaetService;
