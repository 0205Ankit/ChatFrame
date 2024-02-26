"use client";
import React, { useEffect, useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type Message } from "@prisma/client";
import io from "socket.io-client";
const socket = io("http://localhost:8000");

//TODO: make the textarea resizable as the message grow

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  chatId: string;
  senderId: string;
  socketConnected: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageInput = ({
  className,
  chatId,
  senderId,
  socketConnected,
  setIsTyping,
}: PropType) => {
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const queryClient = useQueryClient();
  // const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: () =>
      axios
        .post<Message[]>("http://localhost:8000/api/messages/create", {
          senderId,
          chatId,
          text: message,
          // isReadByReciever: userInChat,
        })
        .then((res) => res.data),
    onSuccess: () => {
      setMessage("");
      void queryClient.invalidateQueries({ queryKey: ["messages"] });
      void queryClient.invalidateQueries({ queryKey: ["getChats"] });
      socket.emit("new message", chatId);
    },
  });

  useEffect(() => {
    if (!socketConnected) return;
    const handleTyping = (roomId: string) => {
      if (roomId !== chatId) return;
      setIsTyping(true);
    };

    const handleStopTyping = (roomId: string) => {
      if (roomId !== chatId) return;
      setIsTyping(false);
    };

    socket.emit("join chat", chatId);
    socket.on("typing", (roomId: string) => handleTyping(roomId));
    socket.on("stop typing", (roomId: string) => handleStopTyping(roomId));
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
    };
  }, [socketConnected, chatId, setIsTyping]);

  const sendMessageHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      socket.emit("stop typing", chatId);
      if (message.trim().length === 0) {
        setMessage("");
        return;
      }
      mutate();
    }
  };

  const typingHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatId);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatId);
        setTyping(false);
      }
    }, timerLength);
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
        className={cn(
          "h-6 w-full resize-none border-none px-1 py-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
        value={message}
        onChange={typingHandler}
      />
      <div className="flex items-center gap-1">
        <IoMicOutline className="cursor-pointer text-2xl" />
        <TbPhotoSquareRounded className="cursor-pointer text-2xl" />
      </div>
    </div>
  );
};

export default MessageInput;
