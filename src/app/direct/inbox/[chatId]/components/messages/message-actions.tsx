import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { RxCopy } from "react-icons/rx";
import { HiOutlineDotsVertical, HiOutlineReply } from "react-icons/hi";
import { LuSend } from "react-icons/lu";
import { cn, getFormattedDateTime } from "@/lib/utils";
import { AiOutlineDelete } from "react-icons/ai";
import MessageReactionPicker from "./message-reaction-picker";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  messageId: string;
  createdAt: Date;
  messageText: string;
  canDeleteMsg: boolean;
  chatId: string;
};

const MessageActions = ({
  className,
  messageId,
  messageText,
  chatId,
  createdAt,
  canDeleteMsg,
}: PropType) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger>
          <HiOutlineDotsVertical />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] rounded-xl p-0 font-medium">
          <p className="px-4 py-2 text-sm">
            {getFormattedDateTime(createdAt).time}
          </p>
          <Separator />
          <Button
            variant={"noStyle"}
            className="flex w-full items-center justify-between transition-all hover:bg-slate-200"
          >
            Forward <LuSend />
          </Button>
          <Button
            onClick={() => navigator.clipboard.writeText(messageText)}
            variant={"noStyle"}
            className="flex w-full items-center justify-between transition-all hover:bg-slate-200"
          >
            Copy <RxCopy />
          </Button>
          <Separator />
          {canDeleteMsg && (
            <Button
              variant={"noStyle"}
              className="flex w-full items-center justify-between text-error transition-all hover:bg-slate-200"
            >
              Delete <AiOutlineDelete />
            </Button>
          )}
        </PopoverContent>
      </Popover>
      <Button variant={"noStyle"} className="p-0">
        <HiOutlineReply />
      </Button>
      <MessageReactionPicker chatId={chatId} messageId={messageId} />
    </div>
  );
};

export default MessageActions;
