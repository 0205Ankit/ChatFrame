import { Button } from "@/components/ui/button";
import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import Picker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/trpc/react";
import socket from "@/utils/socket";

const MessageReactionPicker = ({
  messageId,
  chatId,
}: {
  messageId: string;
  chatId: string;
}) => {
  const utils = api.useUtils();
  const { mutate } = api.chat.updateMessageReaction.useMutation({
    onSuccess: async () => {
      void utils.messages.getMessagesByChatId.invalidate();
      socket.emit("new message reaction", chatId);
    },
  });

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"noStyle"} className="p-0">
          <BsEmojiSmile />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit  rounded-full p-0">
        <Picker
          onEmojiClick={(emoji) => mutate({ messageId, reaction: emoji.emoji })}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MessageReactionPicker;
