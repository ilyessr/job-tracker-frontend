import axios, { AxiosHeaders } from "axios";
import { getAccessToken } from "../lib/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

console.log("API URL =", import.meta.env.VITE_API_URL);

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

export default api;
