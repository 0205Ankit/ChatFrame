"use client";
import React, { useEffect } from "react";
import Post from "./post/post";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { LuBadgeCheck } from "react-icons/lu";
import WelcomeMessage from "../welcome-message";
import { api } from "@/trpc/react";

const HomePage = () => {
  const { ref: lastPostRef, inView } = useInView({
    threshold: 1,
  });
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
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
    return <WelcomeMessage />;
  }

  return (
    <div className="mx-auto my-10 w-10/12">
      {isLoading ? (
        <HomePageSkeleton />
      ) : (
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
              <p className="text-lg tracking-wide">You are all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;

const HomePageSkeleton = () => {
  return (
    <div className="w-[450px]">
      <div className="mb-10 w-full animate-pulse">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-12 w-12 rounded-full bg-slate-300"></div>
          <div>
            <div className="mb-2 h-2 w-40 rounded-full bg-slate-300"></div>
            <div className="h-2 w-20 rounded-full bg-slate-300"></div>
          </div>
        </div>
        <div className="h-[500px] w-full rounded-md bg-slate-300"></div>
      </div>
    </div>
  );
};
