"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import MessageActions from "./message-actions";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  isSender: boolean;
};

const Message = ({ text, isSender }: PropType) => {
  const [showActions, setShowActions] = useState(false);
  return (
    <div
      className={cn("group mb-[2px] flex", {
        "justify-end": isSender,
      })}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <pre
        className={cn(
          "relative w-fit max-w-[400px] rounded-[14px_14px_0_14px] bg-primary px-4 py-2 text-right font-sans font-medium text-white",
          {
            "rounded-[14px_14px_14px_0] bg-slate-300 text-black": !isSender,
          },
        )}
      >
        {text}
        {isSender && showActions && (
          <MessageActions
            className={cn(
              "absolute bottom-1/2 left-0 -translate-x-[calc(100%+10px)] translate-y-1/2 text-slate-700",
            )}
          />
        )}
      </pre>
    </div>
  );
};

export default Message;
