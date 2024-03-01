"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import MessageActions from "./actions";
import { Message } from "@prisma/client";
import ReplyMessageText from "./reply-message-text";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  message: Message & {
    sender: { userName: string };
    repliedToMessage: (Message & { sender: { userName: string } }) | null;
  };
  isSender: boolean;
};

const Message = ({ message, isSender }: PropType) => {
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
        {message.content}
        {showActions && (
          <MessageActions
            message={message}
            createdAt={message.createdAt}
            canDeleteMsg={isSender}
            className={cn(
              "absolute bottom-1/2 left-0 -translate-x-[calc(100%+10px)] translate-y-1/2 text-slate-700",
              {
                "right-0 translate-x-[calc(100%+10px)]": !isSender,
              },
            )}
          />
        )}
      </pre>
    </div>
  );
};

export default Message;
