"use client";
import React, { type HTMLAttributes } from "react";
import { Input } from "./ui/input";
import { IoCloseCircle } from "react-icons/io5";
import { cn } from "Frontend/src/lib/utils";
type PropTypes = HTMLAttributes<HTMLDivElement> & {
  placeholder?: string;
};

const InputWithCloseField = ({ placeholder, className }: PropTypes) => {
  const closeSearchHandler = () => {
    console.log("closeSearchHandler");
  };
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border-2 border-input px-3 py-1",
        className,
      )}
    >
      <Input
        placeholder={placeholder}
        className={cn("border-none focus-visible:ring-0")}
      />
      <IoCloseCircle
        onClick={() => closeSearchHandler}
        className="text-bg-primaryDark cursor-pointer rounded-full text-xl"
      />
    </div>
  );
};

export default InputWithCloseField;
