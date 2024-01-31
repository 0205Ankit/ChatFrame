"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import EmojiPicker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsEmojiSmile } from "react-icons/bs";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
export const CommentInput = ({
  postId,
  replyTo,
  commentId,
}: {
  postId: string;
  replyTo?: { username: string };
  commentId?: string;
}) => {
  const [commentContent, setCommentContent] = React.useState("");
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const disableCommenting =
    commentContent.length === 0 || commentContent.length > 200;
  const { mutate: replyToCommentMutation } =
    api.comments.createReplyTo.useMutation({
      onSuccess: () => {
        router.refresh();
        setCommentContent("");
      },
    });
  const { mutate, isLoading } = api.comments.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setCommentContent("");
    },
  });

  useEffect(() => {
    if (replyTo?.username) {
      setCommentContent(`@${replyTo.username} `);
      inputRef.current?.focus();
    }
  }, [replyTo]);

  const postCommentHandler = () => {
    if (
      commentContent.startsWith("@") &&
      commentContent.includes(" ") &&
      commentId
    ) {
      replyToCommentMutation({
        postId: postId,
        content: commentContent,
        commentId: commentId,
      });
      return;
    }
    mutate({
      postId: postId,
      content: commentContent,
    });
  };

  return (
    <div className="relative flex items-center gap-2 px-4 ">
      <Popover>
        <PopoverTrigger>
          <BsEmojiSmile className="text-xl" />
        </PopoverTrigger>
        <PopoverContent className="w-fit overflow-scroll rounded-xl border-0 p-0">
          <EmojiPicker
            onEmojiClick={(emoji) =>
              setCommentContent(commentContent + emoji.emoji)
            }
          />
        </PopoverContent>
      </Popover>
      <Input
        className="border-none px-0 text-sm focus-visible:ring-0"
        onChange={(e) => setCommentContent(e.target.value)}
        value={commentContent}
        ref={inputRef}
        placeholder="Add a comment..."
      />
      <Button
        onClick={postCommentHandler}
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
