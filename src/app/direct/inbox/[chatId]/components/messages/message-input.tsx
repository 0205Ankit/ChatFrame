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
import socket from "@/utils/socket";
import { api } from "@/trpc/react";

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
  const utils = api.useUtils();
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);

  const usersInChat = usersInRoom.filter((userId) => userId !== senderId);

  const { mutate } = api.messages.createMessage.useMutation({
    onSuccess: () => {
      void utils.chat.getChats.invalidate();
      void utils.messages.getMessagesByChatId.invalidate();
      socket.emit("new message", chatId);
      setMessage("");
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

    // const handleUsersInRoom = (usersInRoom: string[]) => {
    //   setUsersInRoom(usersInRoom);
    // };

    socket.emit("join chat", chatId);
    // socket.on("joined chat", (userIdsInRoom: string[]) =>
    //   handleUsersInRoom(userIdsInRoom),
    // );
    socket.on("typing", (roomId: string) => handleTyping(roomId));
    socket.on("stop typing", (roomId: string) => handleStopTyping(roomId));
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
      // socket.emit("leave chat", chatId);
    };
  }, [socketConnected, chatId, setIsTyping, senderId]);

  const sendMessageHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      socket.emit("stop typing", chatId);
      if (message.trim().length === 0) {
        setMessage("");
        return;
      }
      mutate({
        senderId,
        chatId,
        text: message,
        isReadByRecievers: usersInChat,
      });
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
