import { AxiosRequestConfig } from "axios";
import RestClient from "../Config/RestClient";

const backendService = new RestClient();

export const get = async (path: string, config: AxiosRequestConfig = {}) => {
  return await backendService.get(path, config);
};

export const post = async (path: string, body: any) => {
  return await backendService.post(path, body);
};

export const update = async (path: string, body: any) => {
  return await backendService.put(path, body);
};

export const remove = async (path: string) => {
  return await backendService.del(path);
};
