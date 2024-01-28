import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string().max(200) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          postId: input.postId,
          text: input.content,
          userId: ctx.session.user.id,
        },
      });
    }),
});
