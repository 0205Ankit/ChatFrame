import React, { useEffect } from "react";
import { useContext } from "react";
// import socket from "@/utils/socket";
import { client } from "@/utils/supabase";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";

type SocketContextType = {
  // isSocketConnected: boolean;
  // setIsSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;
};

const SocketContext = React.createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // const [isSocketConnected, setIsSocketConnected] = useState(false);
  const session = useSession();
  // const utils = api.useUtils();
  const { data: chatIds } = api.chat.getOnlyChatIds.useQuery();

  useEffect(() => {
    if (session.data?.user) {
      // socket.emit("setup", session.data?.user);
      // socket.on("connected", () => {
      //   setIsSocketConnected(true); // set Socket Connected State to true
      // });

      // return if chatIds and socket is not connected
      if (!chatIds) return;

      // join the rooms which chat id
      chatIds.forEach((id) => {
        client.channel(id.id);
        // socket.emit("join chat", id.id);
      });
    }
  }, [session.data?.user, chatIds]);

  return (
    <SocketContext.Provider
      value={""}
      // value={{
      //   isSocketConnected,
      //   setIsSocketConnected,
      // }}
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
