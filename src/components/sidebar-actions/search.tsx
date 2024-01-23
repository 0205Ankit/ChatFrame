import React from "react";
import { IoSearch } from "react-icons/io5";

const Search = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary">
      <IoSearch className="text-2xl" /> Search
    </div>
  );
};

export default Search;
