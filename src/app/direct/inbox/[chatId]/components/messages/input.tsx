"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "Frontend/src/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { Textarea } from "Frontend/src/components/ui/textarea";
import { cn } from "Frontend/src/lib/utils";
import socket from "Frontend/src/utils/socket";
import { api } from "Frontend/src/trpc/react";
import { useMessage } from "./messages-context/provider";
import { useSession } from "next-auth/react";
import { IoMdClose } from "react-icons/io";
import { Button } from "Frontend/src/components/ui/button";
import UploadPhoto from "./message-input-actions/upload-photo";
import UploadAudio from "./message-input-actions/upload-audio";

//TODO: make the textarea resizable as the message grow

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  chatId: string;
  senderId: string;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessageInput = ({
  className,
  chatId,
  senderId,
  setIsTyping,
}: PropType) => {
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const utils = api.useUtils();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const currUserName = useSession().data?.user?.userName;
  const {
    focusMessageInput,
    replyMessageId,
    replyMessageText,
    replyMessageUsername,
    reset,
  } = useMessage();

  const { mutate } = api.messages.createMessage.useMutation({
    onSuccess: async () => {
      await Promise.all([
        void utils.chat.getChats.invalidate(),
        void utils.messages.getMessagesByChatId.invalidate(),
      ]);
      socket.emit("new message", chatId);
      setMessage("");
      replyMessageId && reset();
    },
  });

  useEffect(() => {
    if (textAreaRef.current && focusMessageInput) {
      textAreaRef.current.focus();
    }
    const handleTyping = (roomId: string) => {
      if (roomId !== chatId) return;
      setIsTyping(true);
    };

    const handleStopTyping = (roomId: string) => {
      if (roomId !== chatId) return;
      setIsTyping(false);
    };
    socket.on("typing", (roomId: string) => handleTyping(roomId));
    socket.on("stop typing", (roomId: string) => handleStopTyping(roomId));
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
    };
  }, [chatId, setIsTyping, senderId, focusMessageInput]);

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
        content: message,
        replyToMessageId: replyMessageId,
      });
    }
  };

  const typingHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
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
    <div className="relative">
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
          ref={textAreaRef}
        />
        <div className="flex items-center gap-2">
          <UploadAudio chatId={chatId} senderId={senderId} />
          <UploadPhoto chatId={chatId} senderId={senderId} />
        </div>
      </div>
      {replyMessageId && (
        <div className="absolute -top-2 w-full -translate-y-full border-t border-input bg-white p-2 px-5">
          <div className="relative">
            <p className="text-sm font-medium">
              Replying to{" "}
              {replyMessageUsername === currUserName ? (
                "yourself"
              ) : (
                <strong>{replyMessageUsername}</strong>
              )}
            </p>
            <p className="w-1/2 truncate text-xs">{replyMessageText}</p>
            <Button
              className="absolute -top-1 right-2"
              size={"xs"}
              variant={"noStyle"}
              onClick={reset}
            >
              <IoMdClose />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
