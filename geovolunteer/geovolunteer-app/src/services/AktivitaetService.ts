import http from "../http-common";
import { AktivitaetModel, UserModel } from "../types/Types";

const create = (data: AktivitaetModel) => {
  return http.post<any>("/aktivitaet/create", data);
};

const getAll = () => {
  return http.get<Array<UserModel>>("/benutzer");
};

const aktivitaetService = {
  create,
  getAll
};

export default aktivitaetService;
