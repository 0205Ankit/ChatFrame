import { cn } from "@/lib/utils";
import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

type PropTypes = {
  shrink: boolean;
};
const MoreOptions = ({ shrink }: PropTypes) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
        { "px-3": shrink },
      )}
    >
      <RxHamburgerMenu className="text-2xl" /> {!shrink && "More"}
    </div>
  );
};

export default MoreOptions;
