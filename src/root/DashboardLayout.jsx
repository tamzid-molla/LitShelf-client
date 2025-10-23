import React from "react";
import { Outlet } from "react-router";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-base dark:bg-darkBase">
      <DashboardNavbar />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
