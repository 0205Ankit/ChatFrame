import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";

type PropTypes = {
  active?: boolean;
  shrink: boolean;
};
const Messages = ({ active, shrink }: PropTypes) => {
  return (
    <Link
      href="/direct/inbox"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
        { "font-bold": active },
        { "px-3": shrink },
      )}
    >
      {active ? (
        <FaFacebookMessenger className="text-2xl" />
      ) : (
        <RiMessengerLine className="text-2xl" />
      )}
      {!shrink && "Messages"}
    </Link>
  );
};

export default Messages;
