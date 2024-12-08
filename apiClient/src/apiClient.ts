import axios, { AxiosInstance } from "axios";

type HttpClientOptions = {
  baseURL: string;
};

const createHttpClient = (options?: HttpClientOptions): AxiosInstance => {
  const axiosInstance = axios.create({
    ...options,
  });
  return axiosInstance;
};

let client: AxiosInstance;

export const getApiClient = () => {
  if (client === undefined) {
    client = createHttpClient({ baseURL: "https://pokeapi.co/api/v2" });
  }

  return client;
};
