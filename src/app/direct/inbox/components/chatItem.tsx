"use client";
import { getFormattedDateTime, getUnreadMessages } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type GetChat } from "@/types/chat-type";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ChatItem = ({ chat }: { chat: GetChat }) => {
  const { data } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const senderPaticipant = chat.participants.find((user) => {
    return user.userId !== data?.user?.id;
  });
  const unreadMessages = getUnreadMessages({
    messages: chat.messages,
    userId: data?.user?.id ?? "",
  });
  const { mutateAsync } = api.chat.unreadMessages.useMutation({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["getChats"] });
    },
  });

  return (
    <div
      onClick={async () => {
        await mutateAsync({ chatId: chat.id });
        router.replace(`/direct/inbox/${chat.id}`);
      }}
      className="flex justify-between rounded-sm px-4 py-4 hover:bg-slate-100 max-lg:justify-center max-lg:px-2"
    >
      <div className="flex items-center gap-3 max-lg:gap-0">
        <Image
          src={
            senderPaticipant?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
          }
          alt="Profile Picture"
          width={50}
          height={50}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="max-lg:hidden">
          <h5 className="mb-1 font-semibold">
            {senderPaticipant?.user.userName ?? "User"}
          </h5>
          <p className="w-[140px] truncate text-sm font-medium text-slate-500">
            {chat.messages[chat.messages.length - 1]?.text}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end max-lg:hidden">
        <p className="mb-3 text-xs font-semibold text-slate-500">
          {
            getFormattedDateTime(
              chat.messages[chat.messages.length - 1]?.createdAt ?? new Date(),
            ).time
          }
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
