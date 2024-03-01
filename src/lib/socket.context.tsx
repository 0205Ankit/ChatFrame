import React, { useEffect } from "react";
import { useContext, useState } from "react";
import socket from "@/utils/socket";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";

type SocketContextType = {
  isSocketConnected: boolean;
  setIsSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

const SocketContext = React.createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const session = useSession();
  const utils = api.useUtils();

  useEffect(() => {
    if (!session.data?.user) return;
    socket.emit("setup", session.data?.user);
    socket.on("connected", () => {
      setIsSocketConnected(true);
    });
    socket.on("message recieved", async () => {
      await Promise.all([
        void utils.chat.getChats.invalidate(),
        void utils.messages.getMessagesByChatId.invalidate(),
      ]);
    });
  }, [session.data?.user, utils]);

  return (
    <SocketContext.Provider
      value={{
        isSocketConnected,
        setIsSocketConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useComment must be used within a <CommentProvider />");
  }

  return context;
};
