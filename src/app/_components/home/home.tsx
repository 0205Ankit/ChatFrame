"use client";
import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import Post from "./post/post";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";
import { TbPhotoVideo } from "react-icons/tb";

const HomePage = () => {
  const { ref: lastPostRef, inView } = useInView({
    threshold: 1,
  });
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    api.post.getPostForHomePage.useInfiniteQuery(
      {
        pageSize: 2,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (data?.pages[0]?.posts.length === 0) {
    return (
      <div className="mt-10 flex w-full flex-col items-center justify-center gap-1">
        <TbPhotoVideo className="h-16 w-16" />
        <p className="text-center text-lg tracking-wide">
          Follow someone to see <br /> posts on your feed
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 w-10/12">
      <div className="w-[450px]">
        {data?.pages.map((page) => (
          <React.Fragment key={page.nextCursor ?? "nextCursor"}>
            {page.posts.map((post) => (
              <React.Fragment key={post.id}>
                <Post post={post} />
                <span style={{ visibility: "hidden" }} ref={lastPostRef}>
                  intersection observer marker
                </span>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
        {isFetchingNextPage && (
          <div className="flex w-full -translate-y-8 justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}
        {data && !hasNextPage && (
          <div className="flex w-full flex-col items-center justify-center gap-1">
            <LuBadgeCheck className="h-10 w-10 text-primary" />
            <p className="text-lg tracking-wider">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
