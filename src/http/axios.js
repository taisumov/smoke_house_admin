import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const host = axios.create({
  baseURL: process.env.REACT_APP_HOST,
});

const authHost = axios.create({
  baseURL: process.env.REACT_APP_HOST,
});

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${sessionStorage.getItem("jwt")}`;
  config.headers["ngrok-skip-browser-warning"] = `qwerty`;

  return config;
};

host.interceptors.request.use(authInterceptor);

export { host, authHost };
