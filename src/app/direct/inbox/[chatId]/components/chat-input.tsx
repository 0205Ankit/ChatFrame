"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaRegFaceSmile } from "react-icons/fa6";

const ChatInput = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <FaRegFaceSmile className="text-lg" />
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatInput;
