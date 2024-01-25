import React, { useCallback, useState } from "react";
import { TbPhotoVideo } from "react-icons/tb";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/schema/form-schema";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/utils/uploadthing";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IoLocationOutline } from "react-icons/io5";
import { Switch } from "@/components/ui/switch";
import { TextareaWithCounter } from "@/components/textarea-with-counter";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const defaultValues = {
  caption: "",
  location: "",
  image: [],
  hideLikes: false,
  hideComments: false,
};
const CreateForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>([]);

  const form = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: zodResolver(createPostSchema),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach((file) => {
        setSelectedImage((prev) => [...prev, URL.createObjectURL(file)]);
      });
    }
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      alert("uploaded successfully!");
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

  //   const onDrop = useCallback((acceptedFiles) => {
  //     // Do something with the files
  //   }, []);
  //   const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //     onDrop,
  //     multiple: true,
  //     accept: {
  //       "image/*": [],
  //     },
  //     maxFiles: 5,
  //     maxSize: 5 * 1024 * 1024,
  //   });

  return (
    <>
      <p className="bg-primary py-2 text-center text-primary-foreground">
        Create new post
      </p>
      <Form {...form}>
        <form className="flex">
          <div className="min-h-[300px] w-full">
            {selectedImage?.length > 0 ? (
              <Carousel>
                <CarouselContent>
                  {selectedImage?.map((image) => (
                    <CarouselItem
                      key={image}
                      className={cn("flex h-[270px] w-full justify-center")}
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
          {/* -------------------------------------------------------------------------------- */}
          <Separator orientation="vertical" />
          {/* -------------------------------------------------------------------------------- */}
          <div className="min-w-[350px] px-3 pb-5">
            <div>userProfile</div>
            {/* -------------------------------------------------------------------- */}
            <Separator className="my-2" />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaWithCounter
                      placeholder="caption..."
                      hasCounter
                      maxChars={2000}
                      {...field}
                      className="max-h-[100px] min-h-[100px] border-none px-0 focus-visible:ring-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* -------------------------------------------------------------------- */}
            <Separator className="my-2" />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        className="border-none px-0 focus-visible:ring-0"
                        autoComplete="off"
                        placeholder="location"
                        {...field}
                      />
                      <IoLocationOutline className="text-xl" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* -------------------------------------------------------------------- */}
            <Separator className="my-2" />
            <FormField
              control={form.control}
              name="hideLikes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-between">
                      <p>Hide likes on this post</p>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* -------------------------------------------------------------------- */}
            <FormField
              control={form.control}
              name="hideComments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="mt-3 flex items-center justify-between">
                      <p>Turn off commenting</p>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
};

export default CreateForm;
