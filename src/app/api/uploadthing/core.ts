import { db } from "@/server/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const customFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" , maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await db.user.findUnique({
        where: { id: req.headers.get("userId") ?? "" },
      });
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      //   const post = await db.user.upsert({
      //     where: { i: metadata.userId },
      //     update: { image: file.url },
      //     create: { id: metadata.userId, image: file.url },
      //   });

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;
