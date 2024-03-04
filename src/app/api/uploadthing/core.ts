import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const customFileRouter = {
  multipleImageUploader: f({
    image: { maxFileSize: "64MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  singleImageUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),

  audioFileUploader: f({
    audio: { maxFileSize: "2MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
