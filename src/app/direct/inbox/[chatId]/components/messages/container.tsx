"use client";
import React, { useEffect } from "react";
import UserCard from "./user-card";
import { type GetChat } from "@/types/chat-type";
import Message from "./message";
import { useRouter } from "next/navigation";
import { getFormattedDateTime } from "@/lib/utils";
import socket from "@/utils/socket";
import { differenceInMinutes } from "date-fns";
import { api } from "@/trpc/react";

type PropType = {
  chatId: string;
  currUserId: string;
  chat: GetChat;
  isTyping: boolean;
};

const MessagesContainer = ({
  chatId,
  currUserId,
  chat,
  isTyping,
}: PropType) => {
  const senderParticipants = chat.participants.filter((user) => {
    return user.userId !== currUserId;
  });
  const router = useRouter();
  const utils = api.useUtils();

  const { data } = api.messages.getMessagesByChatId.useQuery(
    { chatId },
    {
      onSuccess: () => {
        socket.emit("join chat", chatId);
      },
    },
  );
  const { mutate } = api.messages.unreadMessages.useMutation();

  useEffect(() => {
    socket.on("message reaction received", async () => {
      await Promise.all([
        void utils.chat.getChats.invalidate(),
        void utils.messages.getMessagesByChatId.invalidate(),
      ]);
    });
    mutate({ chatId });
  }, [chatId, router, utils, mutate, data]);

  return (
    <div className="p-5">
      <UserCard
        userName={senderParticipants[0]?.user.userName ?? "User"}
        isGroupChat={chat.type === "GROUP"}
        chatName={chat.name}
        allParticipants={chat.participants}
        profilePhoto={
          senderParticipants[0]?.user.profilePhoto ??
          "/empty-profile-photo.jpeg"
        }
      />
      {data?.map((message, index, messagesArray) => {
        const shouldShowTime =
          differenceInMinutes(
            new Date(message.createdAt),
            new Date(messagesArray[index - 1]?.createdAt ?? 0),
          ) >= 30;
        return (
          <React.Fragment key={message.id}>
            {(index === 0 || shouldShowTime) && (
              <div className=" my-2 flex w-full justify-center text-sm">
                {getFormattedDateTime(message.createdAt).time}
              </div>
            )}
            <Message
              key={message.id}
              message={message}
              isGroupChat={chat.type === "GROUP"}
              isSender={message.senderId === currUserId}
            />
          </React.Fragment>
        );
      })}
      {isTyping && (
        <div className="mt-2  flex w-fit items-center gap-1 rounded-[14px_14px_14px_0] bg-primary px-4 py-3">
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
