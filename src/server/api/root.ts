import { userRouter } from "./routers/user";
import { commentsRouter } from "./routers/comments";
import { likesRouter } from "./routers/likes";
import { searchRouter } from "./routers/search";
import { chatRouter } from "./routers/chat";
import { messagesRouter } from "./routers/message";
import { SignUpRouter } from "./routers/sign-up";
import { postRouter } from "./routers/post";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  comments: commentsRouter,
  likes: likesRouter,
  search: searchRouter,
  chat: chatRouter,
  messages: messagesRouter,
  signUp: SignUpRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
