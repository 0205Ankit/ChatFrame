"use client";
import React from "react";
import ImageSlider from "../image-slider";
import { cn } from "@/lib/utils";
import ProfileCard from "../profile-card";
import { Separator } from "../ui/separator";
import { type PostType } from "@/types/post-type";
import CaptionFormattedText from "./caption-formatted-text";
import CommentFormattedText from "../comment/comment-formatted-text";
import {CommentInput} from "../comment/comment-input";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: PostType;
};

const PostDialog = ({ post }: PropType) => {
  const [replyToUser, setReplyToUser] = React.useState<string>("");
  return (
    <div className={cn("flex")}>
      <ImageSlider
        images={post.images ?? []}
        imageClassName="h-[calc(100vh-80px)]"
        sliderClassName="w-[400px]"
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
          <>
            {post.comments.map((comment) => (
              <div key={comment.id} className="mb-7 px-4">
                <CommentFormattedText comment={comment} setReplyToUser={setReplyToUser} />
              </div>
            ))}
          </>
        )}
        <div className="">
          <CommentInput postId={post.id} replyTo={replyToUser} />
        </div>
      </div>
    </div>
  );
};

export default PostDialog;
