import React, { useCallback, useState } from "react";
import { TbPhotoVideo } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/schema/form-schema";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import LocationField from "./location-field";
import CaptionField from "./caption-field";
import HideLikesField from "./hideLikes-field";
import HideCommentsField from "./hideComments-field";
import { Badge } from "@/components/ui/badge";
import { createPost } from "@/app/mutations";

const defaultValues = {
  caption: "",
  location: "",
  images: [] as string[],
  hideLikes: false,
  hideComments: false,
};
const CreateForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: zodResolver(createPostSchema),
  });
  const selectedImages = form.getValues("images");

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

  async function creatingPost({ images }: { images: string[] }) {
    await createPost({ ...form.getValues(), images: images });
  }

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (data) => {
      const uploadedImagesUrl = data.map((image) => image.url);
      void creatingPost({ images: uploadedImagesUrl });
    },
    onUploadError: () => {
      alert("error occurred while uploading");
    },
    onUploadBegin: () => {
      console.log("upload has begun");
    },
  });

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <>
      <p className="relative bg-primary py-3 text-center text-primary-foreground">
        Create new post
        {selectedImages?.length > 0 && (
          <Badge
            onClick={() => startUpload(files)}
            className="absolute right-10 cursor-pointer"
          >
            Share
          </Badge>
        )}
      </p>
      <FormProvider {...form}>
        <form className="flex">
          <div className="min-h-[300px] w-full">
            {selectedImages?.length > 0 ? (
              <Carousel>
                <CarouselContent>
                  {selectedImages?.map((image) => (
                    <CarouselItem
                      key={image}
                      className={cn("flex h-[300px] w-full justify-center")}
                    >
                      <Image
                        src={image}
                        alt="image"
                        width={300}
                        height={300}
                        className="aspect-square h-full rounded-md object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
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
            <div>userProfile</div>
            <Separator className="my-3" />
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
