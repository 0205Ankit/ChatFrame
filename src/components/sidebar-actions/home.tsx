import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { GoHomeFill } from "react-icons/go";
import { GoHome } from "react-icons/go";

type PropTypes = {
  active?: boolean;
  shrink: boolean;
};
const Home = ({ active, shrink }: PropTypes) => {
  return (
    <Link
      href={"/"}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
        { "font-bold": active },
        { "px-3": shrink },
      )}
    >
      {active ? (
        <GoHomeFill className="text-2xl" />
      ) : (
        <GoHome className="text-2xl" />
      )}
      {!shrink && "Home"}
    </Link>
  );
};

export default Home;
