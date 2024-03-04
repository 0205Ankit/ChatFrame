import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { RxCopy } from "react-icons/rx";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { LuSend } from "react-icons/lu";
import { cn, getFormattedDateTime } from "@/lib/utils";
import { AiOutlineDelete } from "react-icons/ai";
import MessageReplyButton from "./reply-button";
import { type Message } from "@prisma/client";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  createdAt: Date;
  canDeleteMsg: boolean;
  message: Message & { sender: { userName: string } };
};

const MessageActions = ({
  className,
  createdAt,
  canDeleteMsg,
  message,
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
          {message.type === "TEXT" && (
            <Button
              onClick={() => navigator.clipboard.writeText(message.content)}
              variant={"noStyle"}
              className="flex w-full items-center justify-between transition-all hover:bg-slate-200"
            >
              Copy <RxCopy />
            </Button>
          )}
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
      <MessageReplyButton
        messageId={message.id}
        messageUserName={message.sender.userName}
        messageText={message.content}
        messageType={message.type}
      />
      {/* TODO: implement this feature later */}
      {/* <MessageReactionPicker chatId={chatId} messageId={message.id} /> */}
    </div>
  );
};

export default MessageActions;
