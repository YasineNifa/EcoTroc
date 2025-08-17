import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";

export default function RequireAuth() {
  const context = useContext(AuthContext);

  // if (context.isAuthenticated === null) {
  //   return <div>Loading RequireAuth...</div>;
  // }

  if (context.isAuthenticated === true) {
    return <Outlet />;
  }

  return <Navigate to="/signin" />;
}
