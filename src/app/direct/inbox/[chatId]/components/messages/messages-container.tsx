"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import UserCard from "./user-card";
import { type GetChat } from "@/types/chat-type";
import axios from "axios";
import { type Message as MessageType } from "@prisma/client";
import Message from "./message";
import { useRouter } from "next/navigation";
import { getFormattedDateTime } from "@/lib/utils";
import socket from "@/utils/socket";
import { differenceInMinutes } from "date-fns";
import { invalidateQuery } from "@/utils/query-invalidator";

type PropType = {
  chatId: string;
  currUserId: string;
  chat: GetChat;
  socketConnected: boolean;
  isTyping: boolean;
};

const MessagesContainer = ({
  chatId,
  currUserId,
  socketConnected,
  chat,
  isTyping,
}: PropType) => {
  const senderPaticipants = chat.participants.filter((user) => {
    return user.userId !== currUserId;
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await axios.get<MessageType[]>(
        `http://localhost:8000/api/messages/${chatId}`,
      );
      if (!socketConnected) return data;
      socket.emit("join chat", chatId);
      return data;
    },
  });

  useEffect(() => {
    if (!socketConnected) return;
    socket.on("message recieved", async () => {
      await invalidateQuery(["messages", "getChats"], queryClient);
    });
    socket.on("message reaction recieved", async () => {
      await invalidateQuery(["messages", "getChats"], queryClient);
    });
    return () => {
      socket.off("message recieved");
    };
  }, [socketConnected, queryClient, chatId, router]);

  return (
    <div className="p-5">
      <UserCard
        userName={senderPaticipants[0]?.user.userName ?? "User"}
        profilePhoto={
          senderPaticipants[0]?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
        }
      />
      {data?.map((message, index, messagesArray) => {
        const shouldShowTime =
          differenceInMinutes(
            new Date(message.createdAt),
            new Date(messagesArray[index - 1]?.createdAt ?? 0),
          ) >= 30;
        return (
          <>
            {(index === 0 || shouldShowTime) && (
              <div className=" flex w-full justify-center text-sm">
                {getFormattedDateTime(message.createdAt).time}
              </div>
            )}
            <Message
              key={message.id}
              message={message}
              chatId={chatId}
              isSender={message.senderId === currUserId}
            />
          </>
        );
      })}
      {isTyping && (
        <div className="mt-2 flex w-fit items-center gap-1 rounded-[14px_14px_14px_0] bg-primary px-4 py-3">
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
