"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LiaUserEditSolid } from "react-icons/lia";
import ProfilePhoto from "@/components/profile-photo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BsInfoCircle } from "react-icons/bs";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const EditProfile = ({
  profileName,
  userImage,
}: {
  profileName: string;
  userImage: string;
}) => {
  const [userName, setUserName] = useState(profileName);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate } = api.user.updateUserProfileName.useMutation({
    onSuccess: (data) => {
      if (!data) {
        setError("Username already taken");
        return;
      }
      void utils.user.get.invalidate();
      router.replace("/");
      closeDialogHandler();
    },
  });

  const userNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (userName.length > 20) {
      setError("Username must be less than 20 characters");
    }
    if (userName.length <= 3) {
      setError("Username must be greater than 3 characters");
    }
    if (e.target.value.includes(" ")) {
      e.preventDefault();
      return;
    }
    setUserName(e.target.value);
  };

  const closeDialogHandler = () => {
    setOpen(false);
    setUserName(profileName);
    setError(null);
  };

  const updateNameHandler = () => {
    mutate({ profileName: userName });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size={"smallest"}
        className="rounded-full p-2"
      >
        <LiaUserEditSolid className="text-lg" />
      </Button>
      <Dialog open={open} onOpenChange={closeDialogHandler}>
        <DialogContent>
          <div className="flex items-center gap-5">
            <ProfilePhoto image={userImage} className="h-[120px] w-[120px]" />
            <div className="relative">
              <p className="text-2xl font-bold">{profileName}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <BsInfoCircle />
                Change profile name
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  className={cn("focus-visible:ring-0", {
                    "border-error": error,
                  })}
                  value={userName}
                  onChange={userNameHandler}
                />
                <Button onClick={updateNameHandler}>Save</Button>
              </div>
              {error && (
                <p className="absolute top-[calc(100%+5px)] whitespace-nowrap text-xs font-semibold text-error">
                  {error}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfile;
