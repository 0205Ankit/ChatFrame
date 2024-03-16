"use client";
import React from "react";
import UserCard from "./user-card";
import { type GetChat } from "@/types/chat-type";
import Message from "./message";
import { getFormattedDateTime } from "@/lib/utils";
import { differenceInMinutes } from "date-fns";
import { api } from "@/trpc/react";
import { client } from "@/utils/supabase";

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
  const utils = api.useUtils();
  const senderParticipants = chat.participants.filter((user) => {
    return user.userId !== currUserId;
  });

  const { data, isLoading } = api.messages.getMessagesByChatId.useQuery({
    chatId,
  });

  client
    .channel(chatId)
    .on("broadcast", { event: "new message" }, () => {
      void utils.messages.getMessagesByChatId.invalidate();
    })
    .subscribe();

  // socket.on("message received", () => {
  //   void utils.messages.getMessagesByChatId.invalidate();
  // });

  return (
    <>
      {isLoading ? (
        <ChatSkeleton />
      ) : (
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
      )}
    </>
  );
};

export default MessagesContainer;

const ChatSkeleton = () => {
  return (
    <div className="h-full animate-pulse">
      <div className="absolute bottom-10 flex w-full flex-col gap-2 px-5">
        <div className="h-9 w-[200px] self-end rounded-[14px_14px_0px_14px] bg-slate-300"></div>
        <div className="float-right h-9 w-[130px] self-end rounded-[14px_14px_0px_14px] bg-slate-300"></div>
        <div className="float-left h-9 w-[100px] rounded-[14px_14px_14px_0px] bg-slate-300"></div>
        <div className="float-left h-9 w-[150px] rounded-[14px_14px_14px_0px] bg-slate-300"></div>
        <div className="float-right h-9 w-[100px] self-end rounded-[14px_14px_0px_14px] bg-slate-300"></div>
      </div>
    </div>
  );
};
