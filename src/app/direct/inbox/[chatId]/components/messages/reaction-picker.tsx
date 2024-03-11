import { Button } from "@/components/ui/button";
import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import Picker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MessageReactionPicker = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"noStyle"} className="p-0">
          <BsEmojiSmile />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit  rounded-full p-0">
        <Picker />
      </PopoverContent>
    </Popover>
  );
};

export default MessageReactionPicker;
