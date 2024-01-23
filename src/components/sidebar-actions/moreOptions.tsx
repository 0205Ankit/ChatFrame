import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const MoreOptions = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary">
      <RxHamburgerMenu className="text-2xl" /> More
    </div>
  );
};

export default MoreOptions;
