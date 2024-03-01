import { useUploadThing } from "@/utils/uploadthing";
import { useDropzone } from "@uploadthing/react/hooks";
import React, { useCallback } from "react";
import { useToast } from "./use-toast";
import { generateClientDropzoneAccept } from "uploadthing/client";

const useSinglePhotoUpload = () => {
  const { toast } = useToast();
  const [photoUrl, setPhotoUrl] = React.useState<string>();
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);

  const { startUpload, permittedFileInfo } = useUploadThing(
    "singleImageUploader",
    {
      onClientUploadComplete: (data) => {
        setIsUploadingPhoto(false);
        setPhotoUrl(data[0]?.url);
      },
      onUploadError: (err) => {
        toast({
          title: err.message,
          description: "Can't upload more than 1 photos at once",
        });
      },
      onUploadBegin: () => {
        setIsUploadingPhoto(true);
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
    isUploadingPhoto,
    photoUrl,
  };
};

export default useSinglePhotoUpload;
