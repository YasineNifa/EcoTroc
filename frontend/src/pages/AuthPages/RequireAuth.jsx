import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import Loading from "../../components/Loading";

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  console.log(`RequireAuth: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    console.log("RequireAuth: Redirecting to /signin");
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}