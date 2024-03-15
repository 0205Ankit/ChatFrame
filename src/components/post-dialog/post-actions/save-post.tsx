import { useToast } from "Frontend/src/hooks/use-toast";
import { api } from "Frontend/src/trpc/react";
import { useRouter } from "next/navigation";
import React from "react";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";

type PropType = {
  postId: string;
  isSaved: boolean;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
};

const SavePost = ({ isSaved, postId, setIsSaved }: PropType) => {
  const { toast } = useToast();
  const router = useRouter();
  const utils = api.useUtils();
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
      void utils.post.isPostSaved.invalidate();
    },
  });

  const { mutate: unsavePostMutation } = api.post.unsavePost.useMutation({
    onMutate: () => {
      setIsSaved(false);
    },
    onSettled: () => {
      router.refresh();
      void utils.post.getAllPostOfUser.invalidate();
      void utils.post.isPostSaved.invalidate();
    },
  });
  return (
    <>
      {isSaved ? (
        <GoBookmarkFill
          className="cursor-pointer"
          onClick={() => unsavePostMutation({ postId })}
        />
      ) : (
        <GoBookmark
          className="cursor-pointer"
          onClick={() => savePostMutation({ postId })}
        />
      )}
    </>
  );
};

export default SavePost;
