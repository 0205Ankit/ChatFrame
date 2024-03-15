import { api } from "Frontend/src/trpc/react";
import { type PostType } from "Frontend/src/types/post-type";
import React from "react";

const LikesCount = ({ post }: { post: PostType }) => {
  let totalLikesCount = null;
  if (!post.hideLikes) {
    const { data: totalLikes } = api.likes.getTotalLikes.useQuery({
      postId: post.id,
    });
    totalLikesCount = totalLikes;
  }
  return (
    <div>
      {totalLikesCount !== null && totalLikesCount !== undefined && (
        <p className="pl-1 pt-1 text-sm font-semibold">
          {totalLikesCount
            ? `${totalLikesCount} like${totalLikesCount > 1 ? "s" : ""}`
            : "Be the first one to like."}
        </p>
      )}
    </div>
  );
};

export default LikesCount;
