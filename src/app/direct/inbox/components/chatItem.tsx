"use client";
import { getFormattedDateTime } from "@/lib/utils";
import { type GetChat } from "@/types/chat-type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ChatItem = ({ chat }: { chat: GetChat }) => {
  const { data } = useSession();
  const senderPaticipant = chat.participants.find((user) => {
    return user.userId !== data?.user?.id;
  });
  return (
    <Link
      href={`/direct/inbox/${chat.id}`}
      className="flex justify-between rounded-sm px-4 py-2 hover:bg-slate-100"
    >
      <div className="flex items-center gap-3">
        <Image
          src={
            senderPaticipant?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
          }
          alt="Profile Picture"
          width={50}
          height={50}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div>
          <h5 className="mb-1 font-semibold">
            {senderPaticipant?.user.userName ?? "User"}
          </h5>
          <p className="w-[100px] truncate text-sm font-medium text-slate-500">
            {chat.messages[chat.messages.length - 1]?.text}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="mb-3 text-xs font-semibold text-slate-500">
          {
            getFormattedDateTime(
              chat.messages[chat.messages.length - 1]?.createdAt ?? new Date(),
            ).time
          }
        </p>
        <p className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-right text-xs font-medium text-white">
          2
        </p>
      </div>
    </Link>
  );
};

export default ChatItem;
