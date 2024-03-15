"use client";
import React from "react";
import Image from "next/image";
import { AiFillHeart } from "react-icons/ai";
import { IoChatbubble } from "react-icons/io5";
import { type api } from "Frontend/src/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";
import PostDialog from "Frontend/src/components/post-dialog/post-dialog";
import { Dialog, DialogContent } from "Frontend/src/components/ui/dialog";
import { cn } from "Frontend/src/lib/utils";

type PostType = NonNullable<
  inferAsyncReturnType<typeof api.post.getAllPostOfUser.query>[0]
>;

type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: PostType;
};

const Post = ({ post, className }: PropType) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={cn("group relative", { className })}
      >
        <Image
          src={post?.images[0] ?? "/empty-profile-photo.jpeg"}
          alt="post"
          width={100}
          height={100}
          className="aspect-square w-full object-cover"
          unoptimized
        />
        <div className="absolute inset-0 hidden items-center justify-center bg-black/30 group-hover:flex">
          <div className="mr-4 flex items-center gap-1 font-bold text-slate-100">
            <AiFillHeart className="text-xl" /> {post?.likes?.length ?? 0}
          </div>
          <div className="flex items-center gap-1 font-bold text-slate-100">
            <IoChatbubble className="text-xl" /> {post?._count.comments ?? 0}
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[900px] overflow-visible border-none p-0 2xl:min-w-[1200px] ">
          <PostDialog post={post} closeDialogHandler={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Post;
