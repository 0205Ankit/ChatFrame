"use client";
import React from "react";
import ChatItem from "./chatItem";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import CreateGroupChat from "./create-chat";

const ChatList = () => {
  const { data } = api.chat.getChats.useQuery();
  if (!data) return;
  const sortedChats = data.sort((a, b) => {
    return (
      new Date(b.messages[b.messages.length - 1]?.createdAt ?? 0).getTime() -
      new Date(a.messages[a.messages.length - 1]?.createdAt ?? 0).getTime()
    );
  });

  return (
    <div className="flex h-screen w-[450px] flex-col border-r-2 border-input max-lg:w-[100px]">
      <CreateGroupChat />
      <Separator className="mt-6" />
      <ScrollArea className="h-full flex-col items-center justify-center max-lg:flex">
        {sortedChats?.map((chat) => {
          return chat.messages.length > 0 || chat.type === "GROUP" ? (
            <ChatItem key={chat.id} chat={chat} />
          ) : (
            <></>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default ChatList;
