import React from "react";
import UserPicture from "../assets/ProfileIcon.png";

const UserProfile = ({ photo, name }) => {
  // If photo is provided and it's a relative path, prepend the base URL.
  const image = photo
    ? photo.startsWith("http") // Check if it's already a full URL
      ? photo // If it's a full URL, use it directly
      : `http://localhost:8000${photo}` // If it's a relative path, prepend the base URL
    : UserPicture; // Default to the placeholder image

  return (
    <div className="flex items-center gap-2">
      <img
        src={image}
        alt="User Profile Photo"
        className="w-10 h-10 rounded-full"
      />
      <p className="font-semibold">{name}</p>
    </div>
  );
};

export default UserProfile;
