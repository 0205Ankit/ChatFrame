"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/chat-header";
import axios from "axios";
import { type GetChat } from "@/types/chat-type";
import { Separator } from "@/components/ui/separator";
import MessageInput from "./components/messages/message-input";
import MessagesContainer from "./components/messages/messages-container";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import io from "socket.io-client";

let socket;

const ChatPage = ({ params }: { params: { chatId: string } }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useSession();
  const { data } = useQuery({
    queryKey: ["getChat"],
    queryFn: async () => {
      const { data } = await axios.get<GetChat>(
        `http://localhost:8000/api/chat/${params.chatId}`,
      );
      return data;
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
    if (!userData?.user) return;
    socket = io("http://localhost:8000");
    socket.emit("setup", userData?.user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, [userData]);

  if (!data) return;
  if (!userData) return;

  return (
    <div className="relative flex h-screen flex-col">
      <div>
        <ChatHeader currUserId={userData?.user.id} chat={data} />
        <Separator />
      </div>
      <div className="custom-scrollbar h-[calc(100%-160px)] overflow-y-scroll">
        <MessagesContainer
          socketConnected={socketConnected}
          chatId={params.chatId}
          chat={data}
          currUserId={userData?.user.id}
          isTyping={isTyping}
        />
        <div ref={messagesEndRef} />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-white py-4">
        <MessageInput
          socketConnected={socketConnected}
          chatId={params.chatId}
          senderId={userData?.user.id}
          setIsTyping={setIsTyping}
        />
      </div>
    </div>
  );
};

export default ChatPage;
