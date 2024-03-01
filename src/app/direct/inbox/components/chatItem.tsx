"use client";
import { useSocket } from "@/lib/socket.context";
import { getElapsedTime, getLastMessage, getUnreadMessages } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type GetChat } from "@/types/chat-type";
import socket from "@/utils/socket";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChatItem = ({ chat }: { chat: GetChat }) => {
  const { data } = useSession();
  const router = useRouter();
  const utils = api.useUtils();
  const { isSocketConnected } = useSocket();
  const senderPaticipant = chat.participants.find((user) => {
    return user.userId !== data?.user?.id;
  });
  const unreadMessages = getUnreadMessages({
    messages: chat.messages,
    userId: data?.user?.id ?? "",
  });
  const { mutateAsync } = api.messages.unreadMessages.useMutation({
    onSuccess: () => {
      void utils.chat.getChats.invalidate();
    },
  });

  useEffect(() => {
    if (!isSocketConnected) return;
    socket.emit("join chat", chat.id);
  }, [chat.id, isSocketConnected]);

  return (
    <div
      onClick={async () => {
        await mutateAsync({ chatId: chat.id });
        router.replace(`/direct/inbox/${chat.id}`);
      }}
      className="flex justify-between rounded-sm px-4 py-4 hover:bg-slate-100 max-lg:justify-center max-lg:px-2"
    >
      <div className="flex items-center gap-3 max-lg:gap-0">
        <div className="relative">
          <Image
            src={
              senderPaticipant?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
            }
            alt="Profile Picture"
            width={50}
            height={50}
            className="h-14 w-14 rounded-full object-cover"
          />
          {!!unreadMessages && (
            <span className="absolute -top-1 right-0 hidden h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white max-lg:flex">
              {unreadMessages > 9 ? (
                <span className="flex items-start">
                  9<span className="text-[8px]">+</span>
                </span>
              ) : (
                unreadMessages
              )}
            </span>
          )}
        </div>
        <div className="max-lg:hidden">
          <h5 className="mb-1 font-semibold">
            {senderPaticipant?.user.userName ?? "User"}
          </h5>
          <p className="w-[140px] truncate text-sm font-medium text-slate-500">
            {getLastMessage(chat.messages[chat.messages.length - 1])}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end max-lg:hidden">
        <p className="mb-3 text-xs font-semibold text-slate-500">
          {getElapsedTime(
            chat.messages[chat.messages.length - 1]?.createdAt ?? new Date(),
          )}
        </p>
        {!!unreadMessages && (
          <p className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-right text-xs font-medium text-white">
            {unreadMessages > 9 ? (
              <span className="flex items-start">
                9<span className="text-[8px]">+</span>
              </span>
            ) : (
              unreadMessages
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
