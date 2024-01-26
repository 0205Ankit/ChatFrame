import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const customFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "64MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
