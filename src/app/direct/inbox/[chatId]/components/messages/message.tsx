"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import MessageActions from "./message-actions/actions";
import { Message, type User, type MsgType } from "@prisma/client";
import ReplyMessageContent from "./reply-message-content";
import Image from "next/image";
import Link from "next/link";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  message: Message & {
    sender: User;
    repliedToMessage: (Message & { sender: { userName: string } }) | null;
  };
  isSender: boolean;
  isGroupChat: boolean;
};

const MessageContent = ({
  messageType,
  messageContent,
  isSender,
}: {
  messageType: MsgType;
  messageContent: string;
  isSender: boolean;
}) => {
  if (messageType === "TEXT")
    return (
      <pre
        className={cn(
          "w-fit max-w-[400px] rounded-[14px_14px_0_14px] bg-primary px-4 py-2 text-right font-sans font-medium text-white",
          {
            "rounded-[14px_14px_14px_0] bg-slate-300 text-black": !isSender,
          },
        )}
      >
        {messageContent}
      </pre>
    );
  if (messageType === "AUDIO")
    return (
      <audio controls>
        <source src={messageContent} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    );
  if (messageType === "PHOTO")
    return (
      <Link href={messageContent} target="_blank">
        <Image
          src={messageContent}
          alt={messageContent}
          width={200}
          height={300}
          className="h-[300px] rounded-md object-cover"
        />
      </Link>
    );
};

const Message = ({ message, isSender, isGroupChat }: PropType) => {
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
        <ReplyMessageContent message={message} isSender={isSender} />
      )}

      <div
        className={cn("relative flex w-fit items-end gap-1", {
          "flex-row-reverse": isSender,
        })}
      >
        {isGroupChat && (
          <Image
            src={message.sender.profilePhoto ?? "/empty-profile-photo.jpeg"}
            alt="profile"
            width={50}
            height={50}
            className="h-5 w-5 rounded-full object-cover"
          />
        )}
        <div>
          {/* {isGroupChat && !isSender && !message.repliedToMessage && (
            <p className="my-1 text-[10px] font-medium">
              {message.sender.userName}
            </p>
          )} */}
          <MessageContent
            messageType={message.type}
            messageContent={message.content}
            isSender={isSender}
          />
        </div>
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
      </div>
    </div>
  );
};

export default Message;
