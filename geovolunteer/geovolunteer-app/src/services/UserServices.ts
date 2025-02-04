import http from "../http-common";
import { LoginType } from "../login/Login";
import IUserData from "../types/User";

const login = (data: LoginType) => {
  return http.post<any>("/auth", data);
};

const getAll = () => {
  return http.get<Array<IUserData>>("/benutzer");
};

const get = (id: any) => {
  return http.get<IUserData>(`/users/${id}`);
};

const create = (data: IUserData) => {
  return http.post<IUserData>("/create", data);
};

const update = (id: any, data: IUserData) => {
  return http.put<any>(`/users/${id}`, data);
};

const remove = (id: any) => {
  return http.delete<any>(`/users/${id}`);
};

const removeAll = () => {
  return http.delete<any>(`/users`);
};

const findByTitle = (title: string) => {
  return http.get<Array<IUserData>>(`/users?title=${title}`);
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
