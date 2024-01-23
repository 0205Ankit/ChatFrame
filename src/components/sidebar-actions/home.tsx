import React from "react";
import { GoHomeFill } from "react-icons/go";

const Home = () => {
  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary">
      <GoHomeFill className="text-2xl" /> Home
    </div>
  );
};

export default Home;
