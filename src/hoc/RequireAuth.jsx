import { useLocation, Navigate } from "react-router-dom";
import React from "react";

const RequireAuth = ({ children }) => {
  const location = useLocation();

  const JWT = sessionStorage.getItem("jwt");

  if (JWT == null || JWT == "null") {
    return <Navigate to="/auth" state={{ from: location }} />;
  }

  return children;
};

export { RequireAuth };
