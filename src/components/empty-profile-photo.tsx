"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useProfilePhotoUpload from "@/hooks/use-profilePhoto-upload";
import { Loader2 } from "lucide-react";

type PropTypes = React.HTMLAttributes<HTMLImageElement>;
const EmptyProfilePhoto = ({ className }: PropTypes) => {
  const { getInputProps, getRootProps, isUploadingPhoto } =
    useProfilePhotoUpload();
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger>
          <div
            {...getRootProps()}
            className={cn("relative h-32 w-32", {
              className,
            })}
          >
            <input {...getInputProps()} />
            <Image
              src="/empty-profile-photo.jpeg"
              alt="profile"
              width={100}
              height={100}
              className={cn("h-full w-full object-cover")}
            />
            {isUploadingPhoto && (
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/50">
                <Loader2 className="h-2/6 w-2/6 animate-spin font-bold text-slate-200" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-semibold">Add a Profile Photo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmptyProfilePhoto;
