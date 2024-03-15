import { generateComponents } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { CustomFileRouter } from "Frontend/src/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<CustomFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<CustomFileRouter>();
