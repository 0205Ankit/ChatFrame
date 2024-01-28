"use client";
import React from "react";
import ImageSlider from "./image-slider";
import { cn } from "@/lib/utils";
import ProfileCard from "./profile-card";
import { Separator } from "./ui/separator";
import { type PostType } from "@/types/post-type";
import { CommentInput } from "./comment-input";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: PostType;
};

const PostDialog = ({ post }: PropType) => {
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
        <div className="">
          <CommentInput postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDialog;
