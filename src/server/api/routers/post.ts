
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createPostSchema } from "@/schema/form-schema";

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

  getAllPostOfUser: protectedProcedure
    .input(z.object({ profileName: z.string().max(20) }))
    .query(({ ctx, input }) => {
      const posts = ctx.db.post.findMany({
        where: { createdBy: { userName: input.profileName } },
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: true,
          _count: {
            select: { comments: true },
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
            createdBy: true,
            _count: {
              select: { comments: true },
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

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.post.delete({
        where: {
          id: input.postId,
        },
      });
    }),

  getPostForHomePage: protectedProcedure
    .input(
      z.object({
        pageSize: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, pageSize, skip } = input;
      const followedUser = await ctx.db.follows.findMany({
        where: {
          followingId: ctx.session.user.id,
        },
      });

      const modifiedFollowedUser = followedUser.map((user) => {
        return user.followedById;
      });

      const posts = await ctx.db.post.findMany({
        where: {
          createdBy: { id: { in: modifiedFollowedUser } },
        },
        orderBy: { createdAt: "desc" },
        take: pageSize + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: skip,
        include: {
          createdBy: true,
          _count: {
            select: { comments: true },
          },
          likes: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > pageSize) {
        const nextPost = posts.pop(); // return the last item from the array
        nextCursor = nextPost?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  ////////////////////////////////////////////////////////////////////////////////
});
