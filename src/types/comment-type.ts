import { type api } from "Frontend/src/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";

export type ReplyCommentsType = inferAsyncReturnType<
  typeof api.comments.getReplies.query
>[0];

export type CommentsType = inferAsyncReturnType<
  typeof api.comments.getCommentsByPostId.query
>[0];
