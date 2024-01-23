import { cn } from "@/lib/utils";
import React from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";

type PropTypes = {
  shrink: boolean;
};
const Create = ({ shrink }: PropTypes) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
        { "px-3": shrink },
      )}
    >
      <MdOutlineAddCircleOutline className="text-2xl" /> {!shrink && "Create"}
    </div>
  );
};

export default Create;
