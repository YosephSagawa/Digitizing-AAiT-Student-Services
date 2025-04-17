import React from "react";

//Components
import UserProfile from "./UserProfile";

import AAU_Logo from "../assets/AAU_Logo.png";
import SearchLogo from "../assets/SearchLogo.png";
const Navbar = ({ photo, name }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <img src={AAU_Logo} alt="Ayzon Logo" className="w-auto h-14 sm:w-fit" />

      <UserProfile name={name} photo={photo} />
    </div>
  );
};

export default Navbar;
