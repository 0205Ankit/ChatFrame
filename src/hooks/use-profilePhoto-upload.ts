import { api } from "@/trpc/react";
import { useUploadThing } from "@/utils/uploadthing";
import { useDropzone } from "@uploadthing/react/hooks";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useToast } from "./use-toast";
import { generateClientDropzoneAccept } from "uploadthing/client";

const useProfilePhotoUpload = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploadingPost, setIsUploadingPost] = React.useState(false);

  const { mutate } = api.user.updateProfilePhoto.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Can't upload the post right now, Try again later..",
      });
    },
    onSettled: () => {
      setIsUploadingPost(false);
    },
  });
  const { startUpload, permittedFileInfo } = useUploadThing(
    "singleImageUploader",
    {
      onClientUploadComplete: (data) => {
        mutate({ profilePhoto: data[0]?.url ?? "" });
      },
      onUploadError: (err) => {
        toast({
          title: err.message,
          description: "Can't upload more than 4 photos at once",
        });
      },
      onUploadBegin: () => {
        setIsUploadingPost(true);
      },
    },
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      void startUpload(acceptedFiles);
    },
    [startUpload],
  );

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 1,
    multiple: false,
  });

  return {
    getRootProps,
    getInputProps,
    isUploadingPost,
  };
};

export default useProfilePhotoUpload;
