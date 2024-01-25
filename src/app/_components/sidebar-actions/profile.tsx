import React from "react";
import { RiUserLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";

type PropTypes = {
  active?: boolean;
  shrink: boolean;
};
const Profile = ({ active, shrink }: PropTypes) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
        { "font-bold": active },
        { "px-3": shrink },
      )}
    >
      {active ? (
        <FaUserCircle className="text-2xl" />
      ) : (
        <RiUserLine className="text-2xl" />
      )}{" "}
      {!shrink && "Profile"}
    </div>
  );
};

export default Profile;
