import { type api } from "@/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";

export type ReplyCommentsType = inferAsyncReturnType<
  typeof api.comments.getReplies.query
>[0];
