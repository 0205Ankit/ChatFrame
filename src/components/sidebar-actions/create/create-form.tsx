"use client";
import React, { useCallback, useState } from "react";
import { TbPhotoVideo } from "react-icons/tb";
import { Button } from "Frontend/src/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "Frontend/src/schema/form-schema";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "Frontend/src/utils/uploadthing";
import { Separator } from "Frontend/src/components/ui/separator";
import LocationField from "./location-field";
import CaptionField from "./caption-field";
import HideLikesField from "./hideLikes-field";
import HideCommentsField from "./hideComments-field";
import LoadingScreen from "Frontend/src/components/loading-screen";
import { useToast } from "Frontend/src/hooks/use-toast";
import { useDropzone } from "@uploadthing/react/hooks";
import { api } from "Frontend/src/trpc/react";
import { useRouter } from "next/navigation";
import ProfileCard from "Frontend/src/components/profile-card";
import ImageSlider from "Frontend/src/components/image-slider";
import { useSession } from "next-auth/react";

const defaultValues = {
  caption: "",
  location: "",
  images: [] as string[],
  hideLikes: false,
  hideComments: false,
};
const CreateForm = ({
  closeCreateFormDialog,
}: {
  closeCreateFormDialog: () => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadingPost, setIsUploadingPost] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: zodResolver(createPostSchema),
  });
  const selectedImages = form.getValues("images");
  const router = useRouter();
  const { data: session } = useSession();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      if (acceptedFiles.length > 0) {
        acceptedFiles.forEach((file) => {
          const prevImages = form.getValues("images");
          form.setValue("images", [...prevImages, URL.createObjectURL(file)]);
        });
      }
    },
    [form],
  );

  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      router.replace(`/profile/${session?.user.userName}`);
      router.refresh();
      form.reset();
      closeCreateFormDialog();
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
    "multipleImageUploader",
    {
      onClientUploadComplete: (data) => {
        const uploadedImagesUrl = data.map((image) => image.url);
        const postData = { ...form.getValues(), images: uploadedImagesUrl };
        mutate(postData);
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

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    maxFiles: 4,
  });

  return (
    <>
      {isUploadingPost && <LoadingScreen />}
      <div className="relative bg-primary py-3 text-center text-primary-foreground">
        Create new post
        {selectedImages?.length > 0 && (
          <Button
            size={"smallest"}
            onClick={() => startUpload(files)}
            variant={"noStyle"}
            disabled={isUploadingPost}
            className="absolute right-10 cursor-pointer bg-primaryDark px-2 py-1 text-xs text-white"
          >
            Share
          </Button>
        )}
      </div>
      <FormProvider {...form}>
        <form className="flex">
          <div className="min-h-[300px] w-full">
            {selectedImages?.length > 0 ? (
              <div className="flex w-full justify-center">
                <ImageSlider
                  images={selectedImages}
                  imageClassName="h-[280px] rounded-md"
                  sliderClassName="w-[300px]"
                />
              </div>
            ) : (
              <div
                {...getRootProps()}
                className="flex h-full flex-col items-center justify-center"
              >
                <input {...getInputProps()} />
                <TbPhotoVideo className="text-7xl" />
                <p>Drag photos and videos here</p>
                <Button type="button" size={"sm"} className="mt-5">
                  Select from Device
                </Button>
              </div>
            )}
          </div>
          <Separator orientation="vertical" />
          <div className="min-w-[350px] px-3 pb-5">
            <ProfileCard />
            <CaptionField />
            <Separator className="my-3" />
            <LocationField />
            <Separator className="my-3" />
            <HideLikesField />
            <HideCommentsField />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CreateForm;
