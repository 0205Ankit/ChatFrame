"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { IoMicOutline } from "react-icons/io5";
import { TbPhotoSquareRounded } from "react-icons/tb";
import { cn } from "@/lib/utils";

//TODO: make the textarea resizable as the message grow

type PropType = React.HTMLAttributes<HTMLDivElement>;

const MessageInput = ({ className }: PropType) => {
  const [message, setMessage] = React.useState("");
  return (
    <form>
      <div
        className={cn(
          "mx-5 flex items-center gap-2 rounded-3xl border border-input px-5 py-3",
          className,
        )}
      >
        <Popover>
          <PopoverTrigger>
            <BsEmojiSmile className="text-2xl" />
          </PopoverTrigger>
          <PopoverContent className="w-fit overflow-scroll rounded-xl border-0 p-0">
            <EmojiPicker
              onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
            />
          </PopoverContent>
        </Popover>
        <Textarea
          placeholder="Type a message"
          className="h-6 w-full resize-none border-none bg-transparent px-1 py-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex items-center gap-1">
          <IoMicOutline className="cursor-pointer text-2xl" />
          <TbPhotoSquareRounded className="cursor-pointer text-2xl" />
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
