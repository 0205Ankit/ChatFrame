import React from "react";
import ImageSlider from "./image-slider";
import { type inferAsyncReturnType } from "@trpc/server";
import { type api } from "@/trpc/server";
import { cn } from "@/lib/utils";

type PostType = NonNullable<
  inferAsyncReturnType<typeof api.post.getAllPostOfUser.query>[0]
>;
type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: PostType;
};

const PostDialog = ({ post }: PropType) => {
  return (
    <div className={cn("")}>
      <ImageSlider
        images={post?.images ?? []}
        imageClassName="h-[calc(100vh-80px)]"
      />
    </div>
  );
};

export default PostDialog;
