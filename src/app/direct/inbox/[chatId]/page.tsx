"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/chat-header";
import { Separator } from "@/components/ui/separator";
import MessageInput from "./components/messages/input";
import MessagesContainer from "./components/messages/container";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/trpc/react";
import { MessagesProvider } from "./components/messages/messages-context/provider";

const ChatPage = ({ params }: { params: { chatId: string } }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useSession();
  const { data } = api.chat.getChatsById.useQuery({ chatId: params.chatId });

  const { ref: isInViewRef, inView } = useInView();

  useEffect(() => {
    if (!userData?.user) return;
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
    <MessagesProvider>
      <div className="relative flex h-screen flex-col">
        <div>
          <ChatHeader currUserId={userData?.user.id} chat={data} />
          <Separator />
        </div>
        <ScrollArea className="relative h-[calc(100%-160px)]">
          <MessagesContainer
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
        </ScrollArea>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-white py-4">
          <MessageInput
            chatId={params.chatId}
            senderId={userData?.user.id}
            setIsTyping={setIsTyping}
          />
        </div>
      </div>
    </MessagesProvider>
  );
};

export default ChatPage;
