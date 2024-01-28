import React from "react";
import NoSavedPosts from "./no-saved-posts";

const SavedPosts = () => {
  return (
    <div className="mx-auto w-11/12">
      {/* {post?.length === 0 ? ( */}
      <div className="flex h-[300px] w-full items-center justify-center">
        <NoSavedPosts />
      </div>
      {/* ) : (
        <div className="grid w-full grid-cols-3 gap-1">
          {post?.map((individualPost) => (
            <Post key={individualPost.id} post={individualPost} />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default SavedPosts;
