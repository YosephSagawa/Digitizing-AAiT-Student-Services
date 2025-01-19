import React from "react";

//Components
import UserProfile from "./UserProfile";

import AAU_Logo from "../assets/AAU_Logo.png";
import SearchLogo from "../assets/SearchLogo.png";
const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <img src={AAU_Logo} alt="Ayzon Logo" className="w-auto h-14 sm:w-fit" />
      <div className="bg-gray-100 px-3 hidden sm:inline-block">
        <form action="">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            className="bg-gray-100 pr-48 py-1 focus:outline-none"
          />
          <button onClick="submit">
            <img src={SearchLogo} alt="Search Logo" />
          </button>
        </form>
      </div>
      <UserProfile name="Yoseph S." />
    </div>
  );
};

export default Navbar;
