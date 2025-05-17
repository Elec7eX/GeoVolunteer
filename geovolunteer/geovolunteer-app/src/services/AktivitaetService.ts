import http from "../http-common";
import { AktivitaetModel } from "../types/Types";

const create = (data: AktivitaetModel) => {
  return http.post<any>("/aktivitaet/create", data);
};

const getAll = () => {
  return http.get<Array<AktivitaetModel>>("/aktivitaeten");
};

const getById = (id: string) => {
  return http.get<AktivitaetModel>(`/aktivitaet/${id}`);
}

const aktivitaetService = {
  create,
  getAll,
  getById
};

export default aktivitaetService;
