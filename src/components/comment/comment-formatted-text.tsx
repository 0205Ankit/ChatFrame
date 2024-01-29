"use client";
import React from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type PostType } from "@/types/post-type";
import { Button } from "../ui/button";
import { AiOutlineDelete } from "react-icons/ai";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type CommentType = PostType["comments"][number];

type PropType = {
  comment: CommentType;
  setReplyToUser: React.Dispatch<React.SetStateAction<string>>;
};

const CommentFormattedText = ({ comment, setReplyToUser }: PropType) => {
  const { data } = api.user.get.useQuery();
  const { toast } = useToast();
  const router = useRouter();
  const { mutate } = api.comments.delete.useMutation({
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Can't delete the comment right now, Try again later",
      });
    },
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <div className="flex-start flex gap-3">
      <Avatar className="h-7 w-7">
        <AvatarImage src={data?.profilePhoto ?? "/empty-profile-photo.jpeg"} />
        <AvatarFallback>CF</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <pre className="w-[400px] font-sans text-sm">
          <span className="pr-2 font-semibold">{data?.userName}</span>
          {comment.text}
        </pre>
        <div className="group flex items-center gap-2 text-xs">
          <span>12h</span>
          <Button
            onClick={() => setReplyToUser(data?.userName ?? "")}
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
      </div>
    </div>
  );
};

export default CommentFormattedText;
