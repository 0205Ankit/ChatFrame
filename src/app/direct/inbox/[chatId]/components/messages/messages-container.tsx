"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import UserCard from "./user-card";
import { type GetChat } from "@/types/chat-type";
import axios from "axios";
import { type Message as MessageType } from "@prisma/client";
import Message from "./message";
import io from "socket.io-client";
const socket = io("http://localhost:8000");

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

    socket.on("message recieved", () => {
      void queryClient.invalidateQueries({ queryKey: ["messages"] });
    });
    return () => {
      socket.off("message recieved");
    };
  }, [socketConnected, queryClient, chatId]);

  return (
    <div className="p-5 ">
      <UserCard
        userName={senderPaticipants[0]?.user.userName ?? "User"}
        profilePhoto={
          senderPaticipants[0]?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
        }
      />
      {data?.map((message) => {
        return (
          <Message
            key={message.id}
            text={message.text}
            isSender={message.senderId === currUserId}
          />
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
