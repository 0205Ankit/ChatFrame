"use client";
import ImageSlider from "@/components/image-slider";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type api as serverApi } from "@/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PostActions from "./post-actions";
import { useRouter } from "next/navigation";

type PostType = NonNullable<
  inferAsyncReturnType<typeof serverApi.post.getAllPostOfUser.query>[0]
>;

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: PostType;
};
const Post = ({ post }: PropType) => {
  const utils = api.useUtils();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { data } = api.likes.likedByuser.useQuery({ postId: post.id });
  const { data: savedData } = api.post.isPostSaved.useQuery({
    postId: post.id,
  });

  useEffect(() => {
    setIsLiked(Boolean(data));
    setIsSaved(Boolean(savedData));
  }, [data, savedData, post]);

  const { mutate } = api.likes.like.useMutation({
    onMutate: () => {
      setIsLiked(true);
    },
    onSettled: () => {
      router.refresh();
      void utils.likes.likedByuser.invalidate();
      void utils.likes.getTotalLikes.invalidate();
    },
  });

  return (
    <div className="mb-10 w-[450px]">
      <div className="mb-2 flex items-center gap-2">
        <Image
          src={post?.createdBy?.profilePhoto ?? "/empty-profile-photo.jpeg"}
          alt="profile"
          width={100}
          height={100}
          className="h-10 w-10 rounded-full object-cover"
        />
        <h1 className={cn("")}>{post?.createdBy?.userName ?? "user"}</h1>
      </div>
      <ImageSlider
        isPostSlider
        images={post?.images}
        imageClassName="w-full aspect-square rounded-md"
        likePost={() => mutate({ postId: post.id })}
        isLiked={isLiked}
      />
      <PostActions
        post={post}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
      />
    </div>
  );
};

export default Post;
