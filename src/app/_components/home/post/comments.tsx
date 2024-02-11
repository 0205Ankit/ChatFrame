import PostDialog from "@/components/post-dialog/post-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type PostType } from "@/types/post-type";
import React from "react";
import { RiChat3Line } from "react-icons/ri";

const Comments = ({ post }: { post: PostType }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <RiChat3Line className="cursor-pointer" onClick={() => setOpen(true)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[900px] overflow-visible border-none p-0 2xl:min-w-[1200px] ">
          <PostDialog post={post} closeDialogHandler={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Comments;
