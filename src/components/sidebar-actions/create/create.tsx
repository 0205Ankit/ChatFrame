import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateForm from "./create-form";

type PropTypes = {
  shrink: boolean;
};
const Create = ({ shrink }: PropTypes) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
          { "px-3": shrink },
        )}
      >
        <MdOutlineAddCircleOutline className="text-2xl" /> {!shrink && "Create"}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="m-0 min-w-[800px] overflow-hidden border-none p-0">
          <CreateForm closeCreateFormDialog={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Create;
