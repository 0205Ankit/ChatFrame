"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import EmojiPicker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsEmojiSmile } from "react-icons/bs";
import { Loader2 } from "lucide-react";
import React from "react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
export const CommentInput = ({ postId }: { postId: string }) => {
  const [comment, setComment] = React.useState("");
  const disableCommenting = comment.length === 0 || comment.length > 200;
  const { mutate, isLoading } = api.comments.create.useMutation({
    onSuccess: () => {
      setComment("");
    },
  });
  return (
    <div className="relative flex items-center gap-2 px-4 ">
      <Popover>
        <PopoverTrigger>
          <BsEmojiSmile className="text-xl" />
        </PopoverTrigger>
        <PopoverContent className="w-fit overflow-scroll rounded-xl border-0 p-0">
          <EmojiPicker
            onEmojiClick={(emoji) => setComment(comment + emoji.emoji)}
          />
        </PopoverContent>
      </Popover>
      <Input
        className="border-none px-0 text-base focus-visible:ring-0"
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        placeholder="Add a comment..."
      />
      <Button
        onClick={() => mutate({ content: comment, postId: postId })}
        variant={"noStyle"}
        className="justify-self-end font-bold text-primary"
        disabled={disableCommenting}
      >
        Post
      </Button>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 hidden h-full items-center justify-center backdrop-blur-[2px]",
          {
            flex: isLoading,
          },
        )}
      >
        <Loader2 className={cn("m-auto h-5 w-5 animate-spin text-primary")} />
      </div>
    </div>
  );
};
