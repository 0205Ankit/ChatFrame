import { cn } from "@/lib/utils";
import { type Message } from "@prisma/client";
import React from "react";

type PropType = {
  message: Message & {
    repliedToMessage: (Message & { sender: { userName: string } }) | null;
  } & {
    sender: { userName: string };
  };
  isSender: boolean;
};

const ReplyMessageText = ({ message, isSender }: PropType) => {
  return (
    <>
      <p className="mt-1 text-xs">
        {message.repliedToMessage?.sender.userName ===
        message.sender.userName ? (
          <span>
            {isSender
              ? "You replied to yourself"
              : `${message.sender.userName} replied to themselves`}
          </span>
        ) : (
          <span>
            {isSender
              ? `You replied to ${message.repliedToMessage?.sender.userName}`
              : `${message.sender.userName} replied to you`}
          </span>
        )}
      </p>
      <div
        className={cn("my-1 w-fit border-r-4 border-slate-300", {
          "border-l-4 border-r-0": !isSender,
        })}
      >
        <pre
          className={cn(
            "relative mr-2 w-fit max-w-[400px] rounded-full bg-slate-300 px-4 py-2 text-right font-sans text-sm font-medium text-black",
            {
              "ml-2 mr-0": !isSender,
            },
          )}
        >
          {message.repliedToMessage?.text}
        </pre>
      </div>
    </>
  );
};

export default ReplyMessageText;
