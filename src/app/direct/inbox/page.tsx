import { Button } from "@/components/ui/button";
import React from "react";
import { RiMessengerLine } from "react-icons/ri";

const InboxPage = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <RiMessengerLine className="text-8xl" />
      <h1 className="mt-4 text-lg font-semibold">Your messages</h1>
      <span>Send private photos and messages to a friend or group.</span>
      <Button className="mt-3" size={"sm"}>
        Send Message
      </Button>
    </div>
  );
};

export default InboxPage;
