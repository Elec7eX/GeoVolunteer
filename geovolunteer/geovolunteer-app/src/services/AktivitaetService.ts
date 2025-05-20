import http from "../http-common";
import { AktivitaetModel } from "../types/Types";

const BASE_URL = "/aktivitaet"

const create = (data: AktivitaetModel) => {
  return http.post<AktivitaetModel>(BASE_URL + "/create", data);
};

const getAll = () => {
  return http.get<Array<AktivitaetModel>>(BASE_URL + "/aktivitaeten");
};

const getById = (id: string) => {
  return http.get<AktivitaetModel>(BASE_URL + `/${id}`);
}

const aktivitaetService = {
  create,
  getAll,
  getById
};

export default aktivitaetService;
