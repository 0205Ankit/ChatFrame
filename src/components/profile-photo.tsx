"use client";
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "Frontend/src/components/ui/dialog";
import Image from "next/image";
import { cn } from "Frontend/src/lib/utils";
import useProfilePhotoUpload from "Frontend/src/hooks/use-profilePhoto-upload";
import { Loader2 } from "lucide-react";
import { api } from "Frontend/src/trpc/react";
import { useToast } from "Frontend/src/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "Frontend/src/components/ui/tooltip";
import { useRouter } from "next/navigation";

type PropTypes = React.HTMLAttributes<HTMLImageElement> & {
  image: string;
};
const ProfilePhoto = ({ image, className }: PropTypes) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { getInputProps, getRootProps, isUploadingPhoto } =
    useProfilePhotoUpload();

  const prevIsUploadingPhoto = useRef(false);

  useEffect(() => {
    if (prevIsUploadingPhoto.current && isUploadingPhoto) {
      setOpen(false); // Close the modal when isUploadingPhoto changes from false to true
    }
    prevIsUploadingPhoto.current = isUploadingPhoto;
  }, [isUploadingPhoto]);

  const { mutate, isLoading } = api.user.removeProfilePhoto.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Can't upload the Profile Photo, Try again later..",
      });
    },
  });

  if (isUploadingPhoto) {
    prevIsUploadingPhoto.current = true;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={500}>
          <TooltipTrigger
            onClick={() => setOpen(true)}
            className={cn("relative h-32 w-32", className)}
          >
            <Image
              src={image}
              alt="profile"
              width={100}
              height={100}
              className={cn("h-full w-full rounded-full object-cover")}
            />
            {(isUploadingPhoto || isLoading) && (
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/50">
                <Loader2 className="h-2/6 w-2/6 animate-spin font-bold text-slate-200" />
              </div>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs font-semibold">Change profile photo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Change Profile Photo
            </DialogTitle>
            <div className="flex flex-col items-center pt-5">
              <div
                {...getRootProps()}
                className="cursor-pointer py-2 text-sm font-bold text-blue-400"
              >
                <input {...getInputProps()} />
                Upload photo
              </div>
              <div
                onClick={() => {
                  mutate();
                  setOpen(false);
                }}
                className="cursor-pointer py-2 text-sm font-bold text-error"
              >
                Remove Current Photo
              </div>
              <DialogClose className="py-2">
                <span className="text-sm">Cancel</span>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePhoto;
