"use client";
import React, { useState } from "react";
import { RiMessengerLine } from "react-icons/ri";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import CreateChatDialogContent from "Frontend/src/app/direct/inbox/components/create-chat-dialog-content";

const NoChatComponent = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <RiMessengerLine className="text-8xl" />
      <h1 className="mt-4 text-lg font-semibold">Your messages</h1>
      <span>Send private photos and messages to a friend or group.</span>
      <Button onClick={() => setOpen(true)} className="mt-3" size={"sm"}>
        Send Message
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CreateChatDialogContent closeDialog={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoChatComponent;
