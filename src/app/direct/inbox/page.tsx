import NoChatComponent from "@/components/no-chat-component";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const InboxPage = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/");
  }
  return <NoChatComponent />;
};

export default InboxPage;
