import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import socket from "@/utils/socket";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

type PropType = {
  messageId: string;
  chatId: string;
};

const DeleteButton = ({ messageId, chatId }: PropType) => {
  const utils = api.useUtils();
  const { mutate } = api.messages.deleteMessage.useMutation({
    onSuccess: async () => {
      await Promise.all([
        void utils.chat.getChats.invalidate(),
        void utils.messages.getMessagesByChatId.invalidate(),
      ]);
      socket.emit("new message", chatId);
    },
  });
  return (
    <Button
      onClick={() => {
        mutate({ messageId });
      }}
      variant={"noStyle"}
      className="flex w-full items-center justify-between text-error transition-all hover:bg-slate-200"
    >
      Delete <AiOutlineDelete />
    </Button>
  );
};

export default DeleteButton;
