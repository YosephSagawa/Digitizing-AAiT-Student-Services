import React from "react";
import { Outlet } from "react-router-dom";

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
        <div className="flex flex-row flex-wrap sm:grid sm:grid-cols-2 sm:gap-4">
          <DashboardCard
            title="Student Allocation"
            description="Manage students dormitory allocation"
            link="/dashboard/proctor/student_allocation"
            action="Allocation"
          />
          <DashboardCard
            title="Manage Dorms"
            description="Manage dormitory Resources"
            link="/dashboard/proctor/dorm_management"
            action="Dorm Management"
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProctorDashboard;
