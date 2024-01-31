"use client";
import React, { type PropsWithChildren } from "react";
import ImageSlider from "../image-slider";
import { cn } from "@/lib/utils";
import ProfileCard from "../profile-card";
import { Separator } from "../ui/separator";
import { type PostType } from "@/types/post-type";
import CaptionFormattedText from "./caption-formatted-text";
import CommentFormattedText from "../comment/comment-formatted-text";
import { CommentInput } from "../comment/comment-input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type PropType = React.HTMLAttributes<HTMLDivElement> & PropsWithChildren & {
  post: PostType;
};

const PostDialog = ({ post,children,className }: PropType) => {
  const [replyToUser, setReplyToUser] = React.useState<{ username: string }>({
    username: "",
  }); // using state like this so that the component re-renders even if the replyToUser.username is the same as before
  const [commentId, setCommentId] = React.useState<string>("");

  return (
    <Dialog>
      <DialogTrigger className={cn("group relative", { className })}>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[900px] overflow-visible border-none p-0 ">
        <div className={cn("flex")}>
          <ImageSlider
            images={post.images ?? []}
            imageClassName="h-[calc(100vh-80px)]"
            sliderClassName="min-w-[400px] max-w-[400px]"
          />
          <div className="grow">
            <div className="px-4 pt-3">
              <ProfileCard />
            </div>
            <Separator className="my-3" />
            {post.caption && (
              <div className="mb-5 px-4">
                <CaptionFormattedText caption={post.caption} />
              </div>
            )}
            {post.comments && (
              <div className="box-borde mb-7 px-4">
                {post.comments.map((comment) => (
                  <CommentFormattedText
                    key={comment.id}
                    comment={comment}
                    setReplyToUser={setReplyToUser}
                    setCommentId={setCommentId}
                    className="mb-7"
                  />
                ))}
              </div>
            )}
            <CommentInput
              postId={post.id}
              replyTo={replyToUser}
              commentId={commentId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
