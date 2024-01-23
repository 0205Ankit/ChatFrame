"use client";
import React from "react";
import { IoSearch } from "react-icons/io5";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "@/lib/utils";
import InputWithCloseField from "../input-with-close-field";

type PropTypes = {
  shrink: boolean;
  setShrink: React.Dispatch<React.SetStateAction<boolean>>;
};
const Search = ({ shrink, setShrink }: PropTypes) => {
  const [open, setOpen] = React.useState(false);
  const openSheetHandler = () => {
    setOpen(true);
    setShrink(true);
  };

  const closeSheetHandler = () => {
    setOpen(false);
    setShrink(false);
  };

  return (
    <>
      <div
        onClick={openSheetHandler}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-[width] duration-200 hover:bg-primary",
          { "px-3": shrink },
          { "rounded-xl border border-slate-300": open },
        )}
      >
        <IoSearch className="text-2xl" /> {!shrink && "Search"}
      </div>
      <Sheet open={open} onOpenChange={closeSheetHandler}>
        <SheetContent
          side={"left"}
          className="left-20 rounded-br-2xl rounded-tr-2xl data-[state=open]:slide-in-from-left-20 "
        >
          <SheetHeader>
            <div>
              <SheetTitle className="text-2xl font-bold">Search</SheetTitle>
              <InputWithCloseField placeholder="Search" className="mt-5" />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Search;
