import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import Loading from "../../components/Loading";

export default function RequireNotAuth() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  console.log(`RequireNotAuth: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    console.log("RequireNotAuth: Redirecting to /");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}