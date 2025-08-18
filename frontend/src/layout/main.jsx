import React from "react";
import { Outlet } from "react-router";
import Header from "../components/shared/Header";
import NotificationBanner from "../components/shared/NotificationBanner";

function MainLayout() {
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
