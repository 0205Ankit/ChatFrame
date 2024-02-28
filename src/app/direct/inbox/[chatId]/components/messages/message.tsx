"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import MessageActions from "./actions";
import { Message } from "@prisma/client";
import ReplyMessageText from "./reply-message-text";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  message: Message & {
    sender: { userName: string };
    repliedToMessage: Message & { sender: { userName: string } } | null;
  };
  isSender: boolean;
  chatId: string;
};

const Message = ({ message, isSender, chatId }: PropType) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cn("group mb-[2px] flex flex-col", {
        "items-end": isSender,
      })}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {message.repliedToMessageId && message.repliedToMessage && (
        <ReplyMessageText message={message} isSender={isSender} />
      )}
      <pre
        className={cn(
          "relative w-fit max-w-[400px] rounded-[14px_14px_0_14px] bg-primary px-4 py-2 text-right font-sans font-medium text-white",
          {
            "rounded-[14px_14px_14px_0] bg-slate-300 text-black": !isSender,
          },
        )}
      >
        {message.text}
        {showActions && (
          <MessageActions
            message={message}
            createdAt={message.createdAt}
            canDeleteMsg={isSender}
            chatId={chatId}
            className={cn(
              "absolute bottom-1/2 left-0 -translate-x-[calc(100%+10px)] translate-y-1/2 text-slate-700",
              {
                "right-0 translate-x-[calc(100%+10px)]": !isSender,
              },
            )}
          />
        )}
        {message.reaction && (
          <span
            className={cn(
              "absolute -bottom-[2px] flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs",
              {
                "right-0": !isSender,
              },
              {
                "left-0": isSender,
              },
            )}
          >
            {message.reaction}
          </span>
        )}
      </pre>
    </div>
  );
};

export default Message;
