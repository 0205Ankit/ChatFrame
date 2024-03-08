"use client";
import React from "react";
import ChatItem from "./chatItem";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import CreateGroupChat from "./create-chat";
import socket from "@/utils/socket";
// import { usePathname } from "next/navigation";

const ChatList = () => {
  const utils = api.useUtils();
  // const pathname = usePathname();
  const { data, isLoading } = api.chat.getChats.useQuery();
  // const { mutate } = api.messages.unreadMessages.useMutation({
  //   onSuccess: () => {
  //     void utils.chat.getChats.invalidate();
  //     void utils.chat.getTotalUnreadChats.invalidate();
  //   },
  // });

  socket.on("message received", () => {
    // if (pathname === `/direct/inbox/${chatId}`) {
    //   mutate({ chatId });
    //   return;
    // }
    void utils.chat.getChats.invalidate();
  });

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
        {isLoading && (
          <div className="flex animate-pulse items-center gap-3 p-4">
            <div className="h-14 w-14 rounded-full bg-slate-300"></div>
            <div className="flex flex-col gap-3 max-lg:hidden">
              <div className="h-2 w-28 rounded-full bg-slate-300"></div>
              <div className="h-2 w-16 rounded-full bg-slate-300"></div>
            </div>
          </div>
        )}
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
