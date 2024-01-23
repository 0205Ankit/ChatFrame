import React from "react";
import { RiUserLine } from "react-icons/ri";

const Profile = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary">
      <RiUserLine className="text-2xl" /> Profile
    </div>
  );
};

export default Profile;
