"use client";
import React, { useEffect, useRef } from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { AiOutlineDelete } from "react-icons/ai";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CommentReplies from "./comment-replies";
import { cn, getCommentWithMentions, getElapsedTime } from "@/lib/utils";
import { useComment } from "./comment-provider";
import { getUserDetails } from "@/app/queries";
import { type CommentsType } from "@/types/comment-type";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  comment: CommentsType;
  mainCommentId: string;
  isReply?: boolean;
};

const CommentFormattedText = ({
  comment,
  className,
  mainCommentId,
}: PropType) => {
  const showDelete = useRef(false);
  const { setRepliedCommentId, setReplyToUser } = useComment();
  const utils = api.useUtils();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const asyncFunction = async () => {
      const user = await getUserDetails();
      if (comment.userId === user?.id) {
        showDelete.current = true;
      }
    };
    void asyncFunction();
  }, [comment.userId]);

  const { data } = api.user.getByUserName.useQuery({
    profileName: comment.author.userName,
  });
  const { data: replyComments } = api.comments.getReplies.useQuery({
    commentId: comment.id,
  });
  const { mutate } = api.comments.delete.useMutation({
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Can't delete the comment right now, Try again later",
      });
    },
    onSuccess: () => {
      router.refresh();
      void utils.comments.getCommentsByPostId.invalidate();
    },
    onSettled: () => {
      void utils.comments.getReplies.invalidate();
    },
  });

  const replyCommentHandler = () => {
    setReplyToUser({ username: data?.userName ?? "" });
    setRepliedCommentId(mainCommentId);
  };

  return (
    <div className={cn("flex-start flex gap-3", className)}>
      <Avatar className="h-7 w-7">
        <AvatarImage
          className="object-cover"
          src={data?.profilePhoto ?? "/empty-profile-photo.jpeg"}
        />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col gap-1">
        {getCommentWithMentions({
          comment: comment.text,
          userName: data?.userName ?? "",
        })}
        <div className="group flex items-center gap-2 text-xs">
          <span>{getElapsedTime(comment.createdAt)}</span>
          <Button
            onClick={replyCommentHandler}
            variant={"noStyle"}
            className="font-semibold text-slate-500"
            size={"smallest"}
          >
            Reply
          </Button>
          {showDelete.current && (
            <Button
              onClick={() => mutate({ commentId: comment.id })}
              className="hidden text-sm group-hover:block"
              variant={"noStyle"}
              size={"smallest"}
            >
              <AiOutlineDelete />
            </Button>
          )}
        </div>
        {replyComments && replyComments?.length > 0 && (
          <CommentReplies
            comments={replyComments}
            repliedCommentId={mainCommentId}
          />
        )}
      </div>
    </div>
  );
};

export default CommentFormattedText;
