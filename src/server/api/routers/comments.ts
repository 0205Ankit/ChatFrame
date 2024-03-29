import { createTRPCRouter, protectedProcedure } from "../trpc";
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

  delete: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.comment.delete({ where: { id: input.commentId } });
    }),

  createReplyTo: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        content: z.string().max(200),
        postId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          replyToId: input.commentId,
          text: input.content,
          userId: ctx.session.user.id,
          postId: input.postId,
        },
      });
    }),

  getReplies: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { replyToId: input.commentId },
        include: { author: true },
        orderBy: { createdAt: "asc" },
      });
    }),

  getCommentsByPostId: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { postId: input.postId, replyToId: null },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });
    }),
});
