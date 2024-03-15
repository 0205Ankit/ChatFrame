import NoChatComponent from "Frontend/src/components/no-chat-component";
import { getServerAuthSession } from "Frontend/src/server/auth";
import { redirect } from "next/navigation";
import React from "react";

const InboxPage = async () => {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/login");
  }
  return <NoChatComponent />;
};

export default InboxPage;
