import http from "../http-common";
import { LoginType } from "../login/Login";
import { UserModel } from "../types/Types";

const login = (data: LoginType) => {
  return http.post<any>("/auth", data);
};

const getAll = () => {
  return http.get<Array<UserModel>>("/benutzer");
};

const get = (id: any) => {
  return http.get<UserModel>(`/users/${id}`);
};

const create = (data: UserModel) => {
  return http.post<UserModel>("/create", data);
};

const update = (id: any, data: UserModel) => {
  return http.put<any>(`/users/${id}`, data);
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
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default userService;
