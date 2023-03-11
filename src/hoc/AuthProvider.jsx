import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { host } from "../http/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const signin = (login, password, cb) => {
    host
      .post("/api/login", {
        password: password,
        username: login,
      })
      .then((res) => {
        sessionStorage.setItem("jwt", res["data"]);
        cb();
      })
      .catch((err) => {
        console.log(err, "get");
      });
  };
  const signout = (cb) => {
    sessionStorage.setItem("jwt", null);
    navigate("/auth", { replace: true });
    cb();
  };
  const value = { signin, signout };
  const navigate = useNavigate();
  host.interceptors.response.use(
    (data) => {
      return data;
    },
    (err) => {
      console.log(err.response.status);
      if (err.response.status == 401) {
        signout(() => {});
      }
    }
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
