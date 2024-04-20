import RestClient from "../Config/RestClient";

const backendService = new RestClient();

export const get = async (path: string) => {
  return await backendService.get(path);
};

export const post = async (path: string, body: any) => {
  return await backendService.post(path, body);
};

export const update = async (path: string, body: any) => {
  return await backendService.put(path, body);
};

export const remove = async (path: string, id: string | undefined) => {
  const url = path + id;
  return await backendService.del(url);
};
