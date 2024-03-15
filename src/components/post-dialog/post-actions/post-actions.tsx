import React from "react";
import { RiChat3Line } from "react-icons/ri";
import { useComment } from "../../comment/comment-provider";
import { type PostType } from "Frontend/src/types/post-type";
import LikePost from "./like-post";
import SavePost from "./save-post";
import LikesCount from "./likes-count";

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

  return (
    <div className="border-y border-input px-4 py-3">
      <div className="flex items-center justify-between text-2xl">
        <div className="flex items-center gap-2">
          <LikePost postId={post.id} isLiked={isLiked} setIsLiked={setIsLiked} />
          <RiChat3Line
            className="cursor-pointer"
            onClick={() => setFocusCommentInput(true)}
          />
        </div>
        <SavePost isSaved={isSaved} postId={post.id} setIsSaved={setIsSaved}/>
      </div>
      <LikesCount post={post}/>
    </div>
  );
};

export default React.memo(PostActions, (prevProp, nextProp) => {
  return (
    prevProp.isLiked === nextProp.isLiked &&
    prevProp.isSaved === nextProp.isSaved
  );
});

// export default PostActions;
