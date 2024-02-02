import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { RiChat3Line } from "react-icons/ri";
import { useComment } from "../comment/comment-provider";
import { type PostType } from "@/types/post-type";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: PostType;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  isSaved: boolean;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostActions = ({
  post,
  isLiked,
  setIsLiked,
  isSaved,
  setIsSaved,
}: PropType) => {
  const { setFocusCommentInput } = useComment();
  const router = useRouter();
  const utils = api.useUtils();
  const { toast } = useToast();

  const { mutate } = api.likes.like.useMutation({
    onMutate: () => {
      setIsLiked(true);
    },
    onSettled: () => {
      router.refresh();
      void utils.likes.likedByuser.invalidate();
    },
  });

  const { mutate: removeLikeMutation } = api.likes.removeLike.useMutation({
    onMutate: () => {
      setIsLiked(false);
    },
    onSettled: () => {
      router.refresh();
      void utils.likes.likedByuser.invalidate();
    },
  });

  const { mutate: savePostMutation } = api.post.savePost.useMutation({
    onMutate: () => {
      setIsSaved(true);
    },
    onSuccess: () => {
      toast({
        title: "Post saved",
        description: "You can view it in your saved posts.",
      });
    },
    onSettled: () => {
      router.refresh();
      void utils.post.getAllPostOfUser.invalidate();
    },
  });

  const { mutate: unsavePostMutation } = api.post.unsavePost.useMutation({
    onMutate: () => {
      setIsSaved(false);
    },
    onSettled: () => {
      router.refresh();
      void utils.post.getAllPostOfUser.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between border-y border-input px-4 py-3 text-2xl">
      <div className="flex items-center gap-2">
        {isLiked ? (
          <AiFillHeart
            className="cursor-pointer text-primary"
            onClick={() => removeLikeMutation({ postId: post.id })}
          />
        ) : (
          <AiOutlineHeart
            className="cursor-pointer"
            onClick={() => mutate({ postId: post.id })}
          />
        )}
        <RiChat3Line
          className="cursor-pointer"
          onClick={() => setFocusCommentInput(true)}
        />
      </div>
      {isSaved ? (
        <GoBookmarkFill
          className="cursor-pointer"
          onClick={() => unsavePostMutation({ postId: post.id })}
        />
      ) : (
        <GoBookmark
          className="cursor-pointer"
          onClick={() => savePostMutation({ postId: post.id })}
        />
      )}
    </div>
  );
};

export default PostActions;
