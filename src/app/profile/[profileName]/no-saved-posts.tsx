import Link from "next/link";
import React from "react";
import { LuBookmark } from "react-icons/lu";

const NoSavedPosts = () => {
  return (
    <div className="flex w-80 flex-col items-center">
      <LuBookmark className="mb-2 text-4xl" />
      <h6 className="text-xl font-bold">Save Posts</h6>
      <span className="text-center">
        Only you can see what you&apos;ve saved
      </span>
      <Link href={"/"} className="mt-3 text-center font-semibold text-primary">
        Explore Posts
      </Link>
    </div>
  );
};

export default NoSavedPosts;
