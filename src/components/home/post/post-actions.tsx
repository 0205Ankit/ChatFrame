import LikePost from "Frontend/src/components/post-dialog/post-actions/like-post";
import SavePost from "Frontend/src/components/post-dialog/post-actions/save-post";
import { type PostType } from "Frontend/src/types/post-type";
import React from "react";
import Comments from "./comments";
import LikesCount from "Frontend/src/components/post-dialog/post-actions/likes-count";

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
  return (
    <div className="border-y border-input py-3">
      <div className="flex items-center justify-between text-2xl">
        <div className="flex items-center gap-2">
          <LikePost
            postId={post.id}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
          />
          <Comments post={post} />
        </div>
        <SavePost postId={post.id} isSaved={isSaved} setIsSaved={setIsSaved} />
      </div>
      <LikesCount post={post} />
      {post.caption && (
        <p className="mt-1 w-full break-words text-sm">
          <span className="mr-2 font-semibold">{post.createdBy?.userName}</span>
          {post.caption}
        </p>
      )}
    </div>
  );
};

export default React.memo(PostActions, (prevProp, nextProp) => {
  return (
    prevProp.isLiked === nextProp.isLiked &&
    prevProp.isSaved === nextProp.isSaved
  );
});
