"use server";

import { api } from "@/trpc/server";
import { type z } from "zod";
import { type createPostSchema } from "@/schema/form-schema";

export async function createPost(data: z.infer<typeof createPostSchema>) {
  try {
    const post = await api.post.create.mutate(data);
    return { success: true, post };
  } catch (e) {
    console.log(e);
    return null;
  }
}
