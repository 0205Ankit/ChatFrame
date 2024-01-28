import React from "react";
import NoPosts from "./no-posts";
import { api } from "@/trpc/server";
import Post from "./post";

const AllUserPosts = async () => {
  const post = await api.post.getAllPostOfUser.query();
  console.log(post);

  return (
    <div className="mx-auto w-11/12">
      {post?.length === 0 ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <NoPosts />
        </div>
      ) : (
        <div className="grid w-full grid-cols-3 gap-1">
          {post?.map((individualPost) => (
            <Post key={individualPost.id} post={individualPost} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUserPosts;
