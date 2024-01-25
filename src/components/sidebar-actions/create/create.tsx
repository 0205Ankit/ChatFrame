import { cn } from "@/lib/utils";
import React from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateForm from "./create-form";

type PropTypes = {
  shrink: boolean;
};
const Create = ({ shrink }: PropTypes) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md px-2 py-3 text-lg font-medium transition-all duration-200 hover:bg-primary",
              { "px-3": shrink },
            )}
          >
            <MdOutlineAddCircleOutline className="text-2xl" />{" "}
            {!shrink && "Create"}
          </div>
        </DialogTrigger>
        <DialogContent className="m-0 min-w-[800px] overflow-hidden border-none p-0">
          <CreateForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Create;
