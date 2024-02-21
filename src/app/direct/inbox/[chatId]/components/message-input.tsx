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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type Message } from "@prisma/client";

//TODO: make the textarea resizable as the message grow

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  chatId: string;
  senderId: string;
};

const MessageInput = ({ className, chatId, senderId }: PropType) => {
  const [message, setMessage] = React.useState("");
  const { mutate } = useMutation({
    mutationFn: () =>
      axios
        .post<Message[]>("http://localhost:8000/api/messages/create", {
          senderId,
          chatId,
          text: message,
        })
        .then((res) => res.data),
    onSuccess: () => {
      setMessage("");
    },
  });

  const sendMessageHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      mutate();
    }
  };

  return (
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
        onKeyDown={sendMessageHandler}
        className="h-6 w-full resize-none border-none bg-transparent px-1 py-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex items-center gap-1">
        <IoMicOutline className="cursor-pointer text-2xl" />
        <TbPhotoSquareRounded className="cursor-pointer text-2xl" />
      </div>
    </div>
  );
};

export default MessageInput;
