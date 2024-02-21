"use client";
import { type GetChat } from "@/types/chat-type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlinePhone } from "react-icons/ai";
import { HiOutlineVideoCamera } from "react-icons/hi";

const ChatHeader = ({ chat }: { chat: GetChat }) => {
  const { data } = useSession();
  const senderPaticipant = chat.participants.find((user) => {
    return user.userId !== data?.user?.id;
  });
  return (
    <div className="flex items-center justify-between px-8 py-3">
      <Link
        href={`/profile/${senderPaticipant?.user.userName}`}
        className="flex items-center gap-3"
      >
        <Image
          src={
            senderPaticipant?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
          }
          alt="logo"
          width={50}
          height={50}
          className="h-14 w-14 rounded-full object-cover"
        />
        <h2 className="text-xl font-semibold">
          {senderPaticipant?.user.userName ?? "User"}
        </h2>
      </Link>
      <div className="flex items-center gap-3 text-3xl">
        <AiOutlinePhone className="cursor-pointer" />
        <HiOutlineVideoCamera className="cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatHeader;
