import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { RxCopy } from "react-icons/rx";
import { HiOutlineDotsVertical, HiOutlineReply } from "react-icons/hi";
import { LuSend } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { AiOutlineDelete } from "react-icons/ai";

type PropType = React.HTMLAttributes<HTMLDivElement>;

const MessageActions = ({ className }: PropType) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger>
          <HiOutlineDotsVertical />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] rounded-xl p-0 font-medium">
          <p className="px-4 py-2 text-sm">Wed 11:30 AM</p>
          <Separator />
          <Button
            variant={"noStyle"}
            className="flex w-full items-center justify-between transition-all hover:bg-slate-200"
          >
            Forward <LuSend />
          </Button>
          <Button
            variant={"noStyle"}
            className="flex w-full items-center justify-between transition-all hover:bg-slate-200"
          >
            Copy <RxCopy />
          </Button>
          <Separator />
          <Button
            variant={"noStyle"}
            className="flex w-full items-center justify-between text-error transition-all hover:bg-slate-200"
          >
            Delete <AiOutlineDelete />
          </Button>
        </PopoverContent>
      </Popover>
      <Button variant={"noStyle"} className="p-0">
        <HiOutlineReply />
      </Button>
      <Button variant={"noStyle"} className="p-0">
        <BsEmojiSmile />
      </Button>
    </div>
  );
};

export default MessageActions;
