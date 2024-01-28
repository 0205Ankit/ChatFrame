import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { AiFillHeart } from "react-icons/ai";
import { IoChatbubble } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { type api } from "@/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";

type AllPostType = NonNullable<
  inferAsyncReturnType<typeof api.post.getAllPostOfUser.query>[0]
>;
type PropType = React.HTMLAttributes<HTMLDivElement> & {
  post: AllPostType;
};

const Post = ({ className, post }: PropType) => {
  return (
    <Dialog>
      <DialogTrigger className={cn("group relative", { className })}>
        <Image
          src={post?.images[0] ?? "/empty-profile-photo.jpeg"}
          alt="post"
          width={100}
          height={100}
          className="aspect-square w-full object-cover"
        />
        <div className="absolute inset-0 hidden items-center justify-center bg-black/30 group-hover:flex">
          <div className="mr-4 flex items-center gap-1 font-bold text-slate-100">
            <AiFillHeart className="text-xl" /> 0
          </div>
          <div className="flex items-center gap-1 font-bold text-slate-100">
            <IoChatbubble className="text-xl" /> 0
          </div>
        </div>
      </DialogTrigger>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

export default Post;
