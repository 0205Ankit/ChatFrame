import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const likesRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const like = await ctx.db.like.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      if (like) return;
      return ctx.db.like.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),

  likedByuser: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.like.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),

  removeLike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.like.delete({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  getTotalLikes: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.like.count({
        where: {
          postId: input.postId,
        },
      });
    }),
});
