import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createPostSchema } from "@/schema/form-schema";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          createdById: ctx.session.user.id,
          caption: input.caption,
          location: input.location,
          images: input.images,
          hideLikes: input.hideLikes,
          hideComments: input.hideComments,
        },
      });
    }),

  getAllPostOfUser: protectedProcedure.query(({ ctx }) => {
    const posts = ctx.db.post.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
          where: { replyToId: null },
        },
        likes: true,
      },
    });
    return posts;
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  savePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.savedPost.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),

  unsavePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const savedPost = await ctx.db.savedPost.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      if (!savedPost) return;
      return ctx.db.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
    }),

  getAllSavedPost: protectedProcedure.query(({ ctx }) => {
    return ctx.db.savedPost.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        Post: {
          include: {
            comments: {
              orderBy: { createdAt: "desc" },
              where: { replyToId: null },
            },
            likes: true,
          },
        },
      },
    });
  }),

  isPostSaved: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.savedPost.findFirst({
        where: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
