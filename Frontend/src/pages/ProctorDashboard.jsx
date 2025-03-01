import React from "react";

//Components
import DashboardCard from "../components/DashboardCard";
import Navbar from "../components/Navbar";
const ProctorDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="px-6">
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            Proctor Dashboard
          </h1>
        </div>
        <div className="flex flex-row flex-wrap sm:grid sm:grid-cols-3 sm:gap-4">
          <DashboardCard
            title="Manage users"
            description="Manage students and staff"
            link="/manage_users"
          />
          <DashboardCard
            title="Manage RFID issueance"
            description="Issue and deactivare RFID cards"
            link="/RFID_issueance"
          />
          <DashboardCard
            title="Configure access policies"
            description="Configure entry time and access limits"
            link="/access_policy"
          />
        </div>
      </div>
    </div>
  );
};

export default ProctorDashboard;
