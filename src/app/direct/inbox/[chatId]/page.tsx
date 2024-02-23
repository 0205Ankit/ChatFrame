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
import { Button } from "@/components/ui/button";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

let socket;

const ChatPage = ({ params }: { params: { chatId: string } }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
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

  const { ref: isInViewRef, inView } = useInView();

  useEffect(() => {
    if (!userData?.user) return;
    socket = io("http://localhost:8000");
    socket.emit("setup", userData?.user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, [userData]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    setShowScrollButton(false);
    messagesEndRef.current?.scrollIntoView();

    if (!inView) setShowScrollButton(true);
  }, [data?.messages, inView]);

  if (!data) return;
  if (!userData) return;

  return (
    <div className="relative flex h-screen flex-col">
      <div>
        <ChatHeader currUserId={userData?.user.id} chat={data} />
        <Separator />
      </div>
      <div className="custom-scrollbar relative h-[calc(100%-160px)] overflow-y-scroll">
        <MessagesContainer
          socketConnected={socketConnected}
          chatId={params.chatId}
          chat={data}
          currUserId={userData?.user.id}
          isTyping={isTyping}
        />
        <Button
          onClick={() => {
            if (!messagesEndRef.current) return;
            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth",
            });
            setShowScrollButton(false);
          }}
          className={cn(
            "fixed bottom-[100px] right-1/3 hidden rounded-full p-2 text-2xl",
            {
              block: showScrollButton,
            },
          )}
        >
          <MdKeyboardDoubleArrowDown />
        </Button>
        <div ref={isInViewRef} className=" bg-red-400" />
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
