import React from "react";

import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div>
        <div className="flex flex-col w-fit justify-start sm:p-8 mt-2">
          <h1 className="text-2xl sm:text-4xl font-bold mt-8 sm:mt-0">
            DashBoard
          </h1>
          <p className="w-fit p-1 text-gray-400 font-medium">
            Last Updated: Sept 2024
          </p>
        </div>
        <div>
          <h2>Recent Absentees</h2>
          <div></div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Dashboard;
