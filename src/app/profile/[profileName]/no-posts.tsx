"use client";
import CreateForm from "Frontend/src/components/sidebar-actions/create/create-form";
import { Dialog, DialogContent } from "Frontend/src/components/ui/dialog";
import React, { useState } from "react";
import { IoCameraOutline } from "react-icons/io5";

const NoPosts = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-80 flex-col items-center">
      <IoCameraOutline className="mb-2 text-4xl" />
      <h6 className="text-xl font-bold">Share Photos</h6>
      <span className="text-center">
        When you share photos, they will appear on your profile.
      </span>
      <p
        onClick={() => setOpen(true)}
        className="mt-3 text-center font-semibold text-primary"
      >
        Share your first photo
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="m-0 min-w-[800px] overflow-hidden border-none p-0">
          <CreateForm closeCreateFormDialog={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoPosts;
