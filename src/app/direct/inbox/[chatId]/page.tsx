import React from "react";
import ChatHeader from "./components/chat-header";
import axios from "axios";
import { type GetChat } from "@/types/chat-type";
import { Separator } from "@/components/ui/separator";
import MessageInput from "./components/messages/message-input";
import { getServerAuthSession } from "@/server/auth";
import Messages from "./components/messages/messages";

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
      <Messages
        chatId={params.chatId}
        chat={data}
        currUserId={session?.user.id}
      />
      <MessageInput
        chatId={params.chatId}
        senderId={session?.user.id}
        className="absolute inset-x-0 bottom-0 z-10 mb-5"
      />
    </div>
  );
};

export default ChatPage;
