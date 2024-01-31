"use client";
import React from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type PostType } from "@/types/post-type";
import { Button } from "../ui/button";
import { AiOutlineDelete } from "react-icons/ai";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CommentReplies from "./comment-replies";
import { cn, getCommentWithMentions } from "@/lib/utils";

type CommentType = PostType["comments"][number];

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  comment: CommentType;
  setReplyToUser: React.Dispatch<React.SetStateAction<{ username: string }>>;
  setCommentId: React.Dispatch<React.SetStateAction<string>>;
  isReply?: boolean;
};

const CommentFormattedText = ({
  comment,
  setReplyToUser,
  setCommentId,
  className,
}: PropType) => {
  const { data } = api.user.get.useQuery();
  const { data: replyComments } = api.comments.getReplies.useQuery({
    commentId: comment.id,
  });
  const { toast } = useToast();
  const router = useRouter();
  const { mutate } = api.comments.delete.useMutation({
    onError: (err) => {
      console.log(err);
      toast({
        title: "Something went wrong",
        description: "Can't delete the comment right now, Try again later",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  const replyCommentHandler = () => {
    setReplyToUser({ username: data?.userName ?? "" });
    setCommentId(comment.id);
  };

  return (
    <div className={cn("flex-start flex gap-3", className)}>
      <Avatar className="h-7 w-7">
        <AvatarImage src={data?.profilePhoto ?? "/empty-profile-photo.jpeg"} />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col gap-1">
        {getCommentWithMentions({
          comment: comment.text,
          userName: data?.userName ?? "",
        })}
        <div className="group flex items-center gap-2 text-xs">
          <span>12h</span>
          <Button
            onClick={replyCommentHandler}
            variant={"noStyle"}
            className="font-semibold text-slate-500"
            size={"smallest"}
          >
            Reply
          </Button>
          <Button
            onClick={() => mutate({ commentId: comment.id })}
            className="hidden text-sm group-hover:block"
            variant={"noStyle"}
            size={"smallest"}
          >
            <AiOutlineDelete />
          </Button>
        </div>
        {replyComments && replyComments?.length > 0 && (
          <CommentReplies comments={replyComments} commentId={comment.id} />
        )}
      </div>
    </div>
  );
};

export default CommentFormattedText;
