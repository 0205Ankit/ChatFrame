"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import UserCard from "./user-card";
import { type GetChat } from "@/types/chat-type";
import axios from "axios";
import { type Message as MessageType } from "@prisma/client";
import Message from "./message";

type PropType = {
  chatId: string;
  currUserId: string;
  chat: GetChat;
};

const MessagesContainer = ({ chatId, currUserId, chat }: PropType) => {
  const senderPaticipants = chat.participants.filter((user) => {
    return user.userId !== currUserId;
  });
  const { data } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await axios.get<MessageType[]>(
        `http://localhost:8000/api/messages/${chatId}`,
      );
      return data;
    },
  });

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
    </div>
  );
};

export default MessagesContainer;
