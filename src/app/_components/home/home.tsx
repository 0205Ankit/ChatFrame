import { api } from "@/trpc/server";
import React from "react";
import Post from "./post/post";

const HomePage = async () => {
  const data = await api.post.getPostForHomePage.query({ pageSize: 10 });

  return (
    <div className="mx-auto my-10 w-10/12">
      {data?.map((individualPost) => (
        <Post key={individualPost.id} post={individualPost} />
      ))}
    </div>
  );
};

export default HomePage;
