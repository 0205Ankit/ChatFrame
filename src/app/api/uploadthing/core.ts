import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const customFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ file }) => {
    // This code RUNS ON YOUR SERVER after upload
    return { url: file.url };
  }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
