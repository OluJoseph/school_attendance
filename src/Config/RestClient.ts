import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class RestClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://school-attendance-api-t2rk.onrender.com/",
      timeout: 12000,
      headers: {
        Accept: "application/json",
      },
    });
  }

  private getSessionToken(): string | null {
    const sessionToken: string | null = sessionStorage.getItem("amsUser");
    return sessionToken;
  }

  private getConfig(): AxiosRequestConfig {
    // add token to header
    const token: string | null = this.getSessionToken();
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return {};
  }

  get(path: string): Promise<AxiosResponse> {
    return this.axiosInstance.get(path, this.getConfig());
  }

  del(path: string): Promise<AxiosResponse> {
    return this.axiosInstance.delete(path, this.getConfig());
  }

  post(path: string, data: any): Promise<AxiosResponse> {
    return this.axiosInstance.post(path, data, this.getConfig());
  }

  put(path: string, data: any): Promise<AxiosResponse> {
    return this.axiosInstance.put(path, data, this.getConfig());
  }
}

export default RestClient;
