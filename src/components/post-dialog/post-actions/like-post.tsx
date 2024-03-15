import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

type PropType = {
  postId: string;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
};

const LikePost = ({isLiked, setIsLiked , postId}: PropType) => {
    const utils = api.useUtils();
    const router = useRouter();
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

     const { mutate: removeLikeMutation } = api.likes.removeLike.useMutation({
       onMutate: () => {
         setIsLiked(false);
       },
       onSettled: () => {
         router.refresh();
         void utils.likes.getTotalLikes.invalidate();
         void utils.likes.likedByuser.invalidate();
       },
     });
  return (
    <div>
      {isLiked ? (
        <AiFillHeart
          className="cursor-pointer text-primary"
          onClick={() => removeLikeMutation({ postId })}
        />
      ) : (
        <AiOutlineHeart
          className="cursor-pointer"
          onClick={() => mutate({ postId })}
        />
      )}
    </div>
  );
}

export default LikePost