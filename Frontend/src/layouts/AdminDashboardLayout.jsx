import React from "react";
import { Outlet } from "react-router-dom";
//Components
import DashboardCard from "../components/DashboardCard";
import Navbar from "../components/Navbar";
const AdminDashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex flex-row flex-wrap sm:grid sm:grid-cols-3 sm:gap-4">
          <DashboardCard
            title="Manage users"
            description="Manage students and staff"
            link="/dashboard/admin/manage_users"
            action="Manage"
          />
          <DashboardCard
            title="Manage RFID issuance"
            description="Issue and deactivare RFID cards"
            link="/dashboard/admin/RFID_issuance"
            action="Provide Service"
          />
          <DashboardCard
            title="Configure access policies"
            description="Configure entry time and access limits"
            link="/dashboard/admin/access_policy"
            action="Configure"
          />
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
