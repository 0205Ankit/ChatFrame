import React from "react";
import ChatHeader from "./components/chat-header";
import axios from "axios";
import { type GetChat } from "@/types/chat-type";
import { Separator } from "@/components/ui/separator";
import MessageInput from "./components/messages/message-input";
import { getServerAuthSession } from "@/server/auth";
import MessagesContainer from "./components/messages/messages-container";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  const { data } = await axios.get<GetChat>(
    `http://localhost:8000/api/chat/${params.chatId}`,
  );
  const session = await getServerAuthSession();
  if (!data) return;
  if (!session) return;

  return (
    <div className="relative flex h-screen flex-col">
      <div>
        <ChatHeader currUserId={session?.user.id} chat={data} />
        <Separator />
      </div>
      <div className="custom-scrollbar h-[calc(100%-160px)] overflow-y-scroll">
        <MessagesContainer
          chatId={params.chatId}
          chat={data}
          currUserId={session?.user.id}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-white py-4">
        <MessageInput
          chatId={params.chatId}
          senderId={session?.user.id}
          className=""
        />
      </div>
    </div>
  );
};

export default ChatPage;
