"use client";
import React, { useState, type PropsWithChildren, useEffect } from "react";
import ImageSlider from "../image-slider";
import { cn } from "@/lib/utils";
import ProfileCard from "../profile-card";
import { Separator } from "../ui/separator";
import { type PostType } from "@/types/post-type";
import CaptionFormattedText from "./caption-formatted-text";
import CommentFormattedText from "../comment/comment-formatted-text";
import { CommentInput } from "../comment/comment-input";
import { CommentProvider } from "../comment/comment-provider";
import NoComments from "./no-comments";
import PostActions from "./post-actions/post-actions";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { getUserDetails } from "@/app/queries";
import { Button } from "../ui/button";
import { AiOutlineDelete } from "react-icons/ai";

type PropType = React.HTMLAttributes<HTMLDivElement> &
  PropsWithChildren & {
    post: PostType;
    closeDialogHandler: () => void;
  };

const PostDialog = ({ post, closeDialogHandler }: PropType) => {
  const router = useRouter();
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const utils = api.useUtils();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const { data } = api.likes.likedByuser.useQuery({ postId: post.id });
  const { data: savedData } = api.post.isPostSaved.useQuery({
    postId: post.id,
  });

  useEffect(() => {
    setIsLiked(Boolean(data));
    setIsSaved(Boolean(savedData));
    const asyncFunction = async () => {
      const user = await getUserDetails();
      if (!user) return;
      setLoggedInUserId(user?.id);
    };
    void asyncFunction();
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

  const { mutate: deletePost } = api.post.deletePost.useMutation({
    onSuccess: () => {
      router.refresh();
      void utils.post.getAllPostOfUser.invalidate();
      void utils.post.getAllSavedPost.invalidate();
      closeDialogHandler();
    },
  });

  return (
    <CommentProvider>
      <div className={cn("flex")}>
        <ImageSlider
          isPostSlider
          images={post.images ?? []}
          imageClassName="sm:h-[450px] xl:h-[550px] 2xl:h-[650px]"
          sliderClassName="min-w-[400px] max-w-[400px]"
          likePost={() => mutate({ postId: post.id })}
          isLiked={isLiked}
        />
        <div className="flex grow flex-col justify-between">
          <div className="flex items-center justify-between px-4 pt-3">
            <ProfileCard />
            {loggedInUserId === post.createdById && (
              <Button
                onClick={() => deletePost({ postId: post.id })}
                size={"sm"}
                className="mr-7 h-fit rounded-full p-1"
              >
                <AiOutlineDelete />
              </Button>
            )}
          </div>
          <Separator className="mb-2 mt-1" />
          <div className="custom-scrollbar overflow-auto sm:h-[250px] xl:h-[350px] 2xl:h-[450px]">
            {post.caption && (
              <div className="mb-5 px-4">
                <CaptionFormattedText
                  caption={post.caption}
                  userId={post.createdById}
                />
              </div>
            )}
            {post.comments.length > 0 ? (
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
            ) : (
              <NoComments />
            )}
          </div>
          <div className="">
            <PostActions
              post={post}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
              isSaved={isSaved}
              setIsSaved={setIsSaved}
            />
            <CommentInput postId={post.id} />
          </div>
        </div>
      </div>
    </CommentProvider>
  );
};

export default PostDialog;
