"use client";
import React from "react";
import AppLogo from "../../components/app-logo";
import Search from "./sidebar-actions/search";
import Messages from "./sidebar-actions/messages";
import Create from "./sidebar-actions/create/create";
import Profile from "./sidebar-actions/profile";
import MoreOptions from "./sidebar-actions/moreOptions";
import Home from "./sidebar-actions/home";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type PropTypes = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const SideBar = ({ className }: PropTypes) => {
  const pathname = usePathname();
  const [shrink, setShrink] = React.useState(false);
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 box-border flex min-h-screen flex-col justify-between bg-primaryDark px-4 py-10 text-primaryDark-foreground transition-all duration-300",
        className,
        { "w-[80px] items-center": shrink },
      )}
    >
      <AppLogo shrink={shrink} />

      {/* ------------ actions ------------------- */}
      <div className={cn("flex flex-col gap-3", { "gap-4": shrink })}>
        <Home active={pathname === "/"} shrink={shrink} />
        <Search shrink={shrink} setShrink={setShrink} />
        <Messages shrink={shrink} active={pathname.startsWith("/direct")} />
        <Create shrink={shrink} />
        <Profile shrink={shrink} active={pathname.startsWith("/profile")} />
      </div>
      <MoreOptions shrink={shrink} />
    </div>
  );
};

export default SideBar;
