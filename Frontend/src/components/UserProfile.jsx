import React from "react";
import UserPicture from "../assets/ProfileIcon.png";

const UserProfile = ({ photo, name }) => {
  return (
    <div className="flex items-center gap-2">
      <img src={UserPicture} alt="User Profile Photo" />
      {/*This will be replaced by the photo prop of the user it's just for a place holder this has been used*/}
      <p className="font-semibold">{name}</p>
    </div>
  );
};

export default UserProfile;
