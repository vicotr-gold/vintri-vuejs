import axios from "axios";
import { store } from "@/store";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

instance.interceptors.request.use(
  (config) => {
    config.headers["x-user"] = store.getters["auth/user"] || 'test@gmail.com';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
