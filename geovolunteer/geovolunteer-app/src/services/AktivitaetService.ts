import http from "../http-common";
import { AktivitaetModel } from "../types/Types";

const BASE_URL = "/aktivitaet"

const update = (data: AktivitaetModel) => { 
  return http.post<AktivitaetModel>(BASE_URL + "/update", data);
};

const getErstellteAktivitaeten = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/erstellteAktivitaeten");
};

const getAll = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/aktivitaeten");
};

const getById = (id: string) => {
  return http.get<AktivitaetModel>(BASE_URL + `/${id}`);
}

const deleteById = (id: string) => {
  return http.delete(`${BASE_URL}/delete/${id}`);
};

const addTeilnehmer = (id: string) => {
  return http.get<AktivitaetModel>(BASE_URL + `addTeilnehmer/${id}`);
}

const removeTeilnehmer = (id: string) => {
  return http.get<AktivitaetModel>(BASE_URL + `removeTeilnehmer/${id}`);
}

const aktivitaetService = {
  update,
  getErstellteAktivitaeten,
  getAll,
  getById,
  deleteById,
  addTeilnehmer,
  removeTeilnehmer
};

export default aktivitaetService;
