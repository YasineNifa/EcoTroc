import React from "react";
import { Outlet } from "react-router";
import Header from "../components/shared/Header";

function MainLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
