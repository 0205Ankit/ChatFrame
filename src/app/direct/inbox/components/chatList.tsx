import React from "react";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { getServerAuthSession } from "@/server/auth";
import { type GetChat } from "@/types/chat-type";
import ChatItem from "./chatItem";
import { Separator } from "@/components/ui/separator";

const ChatList = async () => {
  const session = await getServerAuthSession();
  const { data } = await axios.get<GetChat[]>(
    "http://localhost:8000/api/chat",
    {
      data: {
        userId: session?.user.id,
      },
    },
  );
  if (!data) return;
  return (
    <div className="w-[450px] border-r-2 border-input">
      <div className="flex items-center justify-between px-4 pt-5 text-2xl font-bold">
        Chat
        <Button className="rounded-full bg-primary" size={"sm"}>
          <IoMdAdd className="text-xl" />
        </Button>
      </div>
      <Separator className="my-6" />
      <div className="">
        {data?.map((chat) => {
          // return chat.messages.length > 0 ? (
          //   <ChatItem key={chat.id} chat={chat} />
          // ) : (
          //   <></>
          // );
          return <ChatItem key={chat.id} chat={chat} />;
        })}
      </div>
    </div>
  );
};

export default ChatList;
