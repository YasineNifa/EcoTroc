import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";

export default function RequireNotAuth() {
  const context = useContext(AuthContext);

  // if (isAuthenticated === null) {
  //   return <div>Loading RequireNotAuth...</div>;
  // }

  if (context.isAuthenticated === true) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
