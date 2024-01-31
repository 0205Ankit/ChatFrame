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
import { CommentProvider } from "../comment/comment-provider";

type PropType = React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    post: PostType;
  };

const PostDialog = ({ post, children, className }: PropType) => {
  return (
    <Dialog>
      <DialogTrigger className={cn("group relative", { className })}>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[900px] overflow-visible border-none p-0 ">
        <div className={cn("flex")}>
          <CommentProvider>
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
                <div className="px-4">
                  {post.comments.map((comment) => (
                    <CommentFormattedText
                      key={comment.id}
                      comment={comment}
                      mainCommentId={comment.id}
                      className="mb-5"
                    />
                  ))}
                </div>
              )}
              <CommentInput postId={post.id} />
            </div>
          </CommentProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
