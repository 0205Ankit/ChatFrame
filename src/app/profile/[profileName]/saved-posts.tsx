import React from "react";
import NoSavedPosts from "./no-saved-posts";
import { api } from "Frontend/src/trpc/server";
import Post from "./post";

const SavedPosts = async () => {
  const savedPost = await api.post.getAllSavedPost.query();
  return (
    <div className="mx-auto w-11/12">
      {savedPost?.length === 0 ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <NoSavedPosts />
        </div>
      ) : (
        <div className="grid w-full grid-cols-3 gap-1">
          {savedPost?.map((individualPost) => (
            <Post key={individualPost.id} post={individualPost.Post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
