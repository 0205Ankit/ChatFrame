"use client";
import { MultipleUserPhoto } from "@/components/multiple-user-photo";
import { type GetChat } from "@/types/chat-type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ChatSettings from "./chat-settings";

type PropType = {
  chat: GetChat;
  currUserId: string;
};

const ChatHeader = ({ chat, currUserId }: PropType) => {
  const { data } = useSession();
  const senderParticipant = chat.participants.find((user) => {
    return user.userId !== currUserId;
  });
  const allParticipantsPhotos = chat.participants.map(
    (participant) =>
      participant.user.profilePhoto ?? "/empty-profile-photo.jpeg",
  );
  return (
    <div className="flex items-center justify-between px-8 py-3">
      {chat.type === "ONE_TO_ONE" ? (
        <Link
          href={`/profile/${senderParticipant?.user.userName}`}
          className="flex items-center gap-3"
        >
          <Image
            src={
              senderParticipant?.user.profilePhoto ??
              "/empty-profile-photo.jpeg"
            }
            alt="logo"
            width={50}
            height={50}
            className="h-14 w-14 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold">
            {senderParticipant?.user.userName ?? "User"}
          </h2>
        </Link>
      ) : (
        <div className="flex items-center gap-3">
          <MultipleUserPhoto userImages={allParticipantsPhotos} imgSize={56} />
          {chat.name ? (
            <p className="w-[300px] truncate font-semibold">{chat.name}</p>
          ) : (
            <p className="w-[300px] truncate font-semibold">
              {chat.participants
                .filter((participant) => participant.userId !== data?.user?.id)
                .map((participant) => participant.user.userName ?? "User")
                .join(", ")}
            </p>
          )}
        </div>
      )}
      {/* <div className="flex items-center gap-3 text-3xl">
        <AiOutlinePhone className="cursor-pointer" />
        <HiOutlineVideoCamera className="cursor-pointer" />
      </div> */}
      {chat.type === "GROUP" && <ChatSettings chatId={chat.id} />}
    </div>
  );
};

export default ChatHeader;
