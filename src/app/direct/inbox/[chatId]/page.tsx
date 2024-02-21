import React from "react";
import ChatHeader from "./components/chat-header";
import axios from "axios";
import { type GetChat } from "@/types/chat-type";
import { Separator } from "@/components/ui/separator";

const ChatPage = async ({ params }: { params: { chatId: string } }) => {
  const { data } = await axios.get<GetChat>(
    `http://localhost:8000/api/chat/${params.chatId}`,
  );

  return (
    <div>
      <ChatHeader chat={data} />
      <Separator />
    </div>
  );
};

export default ChatPage;
