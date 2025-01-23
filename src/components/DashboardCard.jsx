import React from "react";
import { NavLink } from "react-router-dom";
const DashboardCard = ({ title, description, link }) => {
  return (
    <div className="flex flex-col w-full justify-start p-8 mt-2 border-2 rounded-md">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      <p>{description}</p>
      <NavLink to={`${link}`}>
        <button className="bg-midblue hover:bg-black text-white font-bold py-2 px-4 rounded mt-2">
          View Report
        </button>
      </NavLink>
    </div>
  );
};

export default DashboardCard;
