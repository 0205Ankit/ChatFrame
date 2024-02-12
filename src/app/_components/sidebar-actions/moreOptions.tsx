import { cn } from "@/lib/utils";
import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoBookmark } from "react-icons/go";
import { TbActivity } from "react-icons/tb";
import { IoLogOutOutline } from "react-icons/io5";
import { signOut } from "next-auth/react";

type PropTypes = {
  shrink: boolean;
};
const MoreOptions = ({ shrink }: PropTypes) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium outline-none transition-all duration-200 hover:bg-primary focus:ring-0 data-[state=open]:bg-primary",
          { "px-3": shrink },
        )}
      >
        <RxHamburgerMenu className="text-2xl" /> {!shrink && "More"}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[220px]">
        <DropdownMenuItem className="cursor-pointer gap-2 text-lg font-medium">
          <GoBookmark /> Saved
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 text-lg font-medium">
          <TbActivity /> Your Activity
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer gap-2 text-lg font-medium"
        >
          <IoLogOutOutline /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreOptions;
