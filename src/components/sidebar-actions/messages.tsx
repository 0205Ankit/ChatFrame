import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";

const Messages = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary">
      <FaFacebookMessenger className="text-2xl" /> Messages
    </div>
  );
};

export default Messages;
