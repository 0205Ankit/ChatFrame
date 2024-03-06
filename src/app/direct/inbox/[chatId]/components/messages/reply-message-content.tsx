import { cn } from "@/lib/utils";
import { type Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type PropType = {
  message: Message & {
    repliedToMessage: (Message & { sender: { userName: string } }) | null;
  } & {
    sender: { userName: string };
  };
  isSender: boolean;
};

const ReplyMessageContent = ({ message, isSender }: PropType) => {
  const isAPhoto = message.repliedToMessage?.type === "PHOTO";
  const isAText = message.repliedToMessage?.type === "TEXT";
  const isAudio = message.repliedToMessage?.type === "AUDIO";
  const { data } = useSession();

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
            {isSender ? (
              `You replied to ${message.repliedToMessage?.sender.userName}`
            ) : (
              <span>
                {message.repliedToMessage?.sender.userName ===
                data?.user?.userName
                  ? `${message.sender.userName} replied to you`
                  : `${message.sender.userName} replied to ${message.repliedToMessage?.sender.userName}`}
              </span>
            )}
          </span>
        )}
      </p>
      <div
        className={cn("my-1 w-fit border-r-4 border-slate-300 pr-2", {
          "border-l-4 border-r-0 pl-2 pr-0": !isSender,
        })}
      >
        {isAPhoto && (
          <Image
            src={message.repliedToMessage?.content ?? "/no-image.png"}
            alt={message.repliedToMessage?.content ?? "no-image"}
            width={200}
            height={300}
            className="h-[200px] rounded-md object-cover"
          />
        )}
        {isAudio && (
          <audio controls className="w-[220px]">
            <source src={message.repliedToMessage?.content} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
        {isAText && (
          <pre
            className={cn(
              "relative w-fit max-w-[400px] rounded-full bg-slate-300 px-4 py-2 text-right font-sans text-sm font-medium text-black",
            )}
          >
            {message.repliedToMessage?.content}
          </pre>
        )}
      </div>
    </>
  );
};

export default ReplyMessageContent;
