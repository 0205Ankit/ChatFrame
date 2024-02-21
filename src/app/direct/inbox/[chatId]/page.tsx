import React from "react";
import ChatHeader from "./components/chat-header";
import axios from "axios";
import { type GetChat } from "@/types/chat-type";
import { Separator } from "@/components/ui/separator";
import MessageInput from "./components/message-input";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  const { data } = await axios.get<GetChat>(
    `http://localhost:8000/api/chat/${params.chatId}`,
  );

  return (
    <div className="relative flex h-screen flex-col">
      <div>
        <ChatHeader chat={data} />
        <Separator />
      </div>
      <MessageInput className="absolute inset-x-0 bottom-0 z-10 mb-5" />
    </div>
  );
};

export default ChatPage;
