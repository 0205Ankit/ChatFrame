"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserCard from "./user-card";
import { type GetChat } from "@/types/chat-type";
import axios from "axios";
import { type Message } from "@prisma/client";

type PropType = {
  chatId: string;
  currUserId: string;
  chat: GetChat;
};

const Messages = ({ chatId, currUserId, chat }: PropType) => {
  const senderPaticipants = chat.participants.filter((user) => {
    return user.userId !== currUserId;
  });
  const { data } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await axios.get<Message[]>(
        `http://localhost:8000/api/messages/${chatId}`,
      );
      return data;
    },
  });

  return (
    <div className="p-5">
      <UserCard
        userName={senderPaticipants[0]?.user.userName ?? "User"}
        profilePhoto={
          senderPaticipants[0]?.user.profilePhoto ?? "/empty-profile-photo.jpeg"
        }
      />

      {data?.map((message) => {
        return <div key={message.id}>{message.text}</div>;
      })}
    </div>
  );
};

export default Messages;
