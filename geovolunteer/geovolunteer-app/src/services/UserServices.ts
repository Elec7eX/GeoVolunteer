import http from "../http-common";
import { UserModel } from "../types/Types";

const BASE_URL = "/benutzer"

const login = (data: UserModel) => {
  return http.post<UserModel>(BASE_URL + "/login", data);
};

const logout = () => {
  return http.post(BASE_URL + "/logout");
};

const create = (data: UserModel) => {
  return http.post<UserModel>(BASE_URL +"/create", data);
};

const getAll = () => {
  return http.get<Array<UserModel>>("/benutzer");
};

const getFreiwillige = () => {
  return http.get<Array<UserModel>>(BASE_URL + "/freiwillige");
}

const get = (id: any) => {
  return http.get<UserModel>(BASE_URL + `/${id}`);
};

const update = (id: any, data: UserModel) => {
  return http.put<any>(BASE_URL + `/update/${id}`, data);
};

const remove = (id: any) => {
  return http.delete<any>(`/users/${id}`);
};

const removeAll = () => {
  return http.delete<any>(`/users`);
};

const findByTitle = (title: string) => {
  return http.get<Array<UserModel>>(`/users?title=${title}`);
};

const userService = {
  login,
  logout,
  getAll,
  getFreiwillige,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default userService;
