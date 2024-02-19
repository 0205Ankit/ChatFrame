"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const ChatList = () => {
  // const session = await getServerAuthSession();
  const { data: authData } = useSession();
  const { data } = useQuery({
    queryKey: ["sdkcj"],
    queryFn: () =>
      axios.get("http://localhost:8000/api/chat", {
        data: { userId: authData?.user.id },
      }),
  });
  console.log(data?.data);
  // const data = await axios.get("http://localhost:8000/api/chat", {
  //   data: {
  //     userId: session?.user.id,
  //   },
  // });

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
