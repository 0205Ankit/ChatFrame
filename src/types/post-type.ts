import { type api } from "Frontend/src/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";

export type PostType = NonNullable<
  inferAsyncReturnType<typeof api.post.getAllPostOfUser.query>[0]
>;
