import React from "react";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { getServerAuthSession } from "@/server/auth";
import { type GetAllChat } from "@/types/chat-type";

const ChatList = async () => {
  const session = await getServerAuthSession();
  const { data } = await axios.get<GetAllChat>(
    "http://localhost:8000/api/chat",
    {
      data: {
        userId: session?.user.id,
      },
    },
  );

  return (
    <div className="w-[450px] border-r-2 border-input p-5">
      <div className="flex items-center justify-between text-2xl font-bold">
        Chat
        <Button className="rounded-full bg-primary" size={"sm"}>
          <IoMdAdd className="text-xl" />
        </Button>
      </div>
    </div>
  );
};

export default ChatList;
