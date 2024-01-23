import React from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const Create = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary">
      <MdOutlineAddCircleOutline className="text-2xl" /> Create
    </div>
  );
};

export default Create;
