import { cn } from "@/lib/utils";
import React from "react";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  isSender: boolean;
};

const Message = ({ text, isSender }: PropType) => {
  return (
    <div
      className={cn("relative mb-[2px] flex", {
        "justify-end": isSender,
      })}
    >
      <pre
        className={cn(
          "w-fit rounded-[12px_12px_0_12px] bg-primary px-4 py-2 text-right font-sans font-medium text-white",
          {
            "rounded-[12px_12px_12px_0] bg-slate-300 text-black": !isSender,
          },
        )}
      >
        {text}
      </pre>
    </div>
  );
};

export default Message;
