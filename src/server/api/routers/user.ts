import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const user = ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        posts: true,
        likes: true,
        Comments: true,
        following: true,
        followedBy: true,
      },
    });
    return user;
  }),

  getByUserName: protectedProcedure
    .input(z.object({ profileName: z.string().max(20) }))
    .query(({ ctx, input }) => {
      const user = ctx.db.user.findUnique({
        where: { userName: input.profileName },
        include: {
          posts: true,
          likes: true,
          Comments: true,
          following: true,
          followedBy: true,
        },
      });
      return user;
    }),

  updateProfilePhoto: protectedProcedure
    .input(z.object({ profilePhoto: z.string() }))
    .mutation(({ ctx, input }) => {
      const user = ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          profilePhoto: input.profilePhoto,
        },
      });
      return user;
    }),

  removeProfilePhoto: protectedProcedure.mutation(({ ctx }) => {
    const user = ctx.db.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        profilePhoto: null,
      },
    });
    return user;
  }),

  checkUserExistByUserName: protectedProcedure
    .input(z.object({ profileName: z.string() }))
    .query(({ ctx, input }) => {
      const user = ctx.db.user.findUnique({
        where: { userName: input.profileName },
      });
      return user;
    }),

  checkUserLoggedIn: protectedProcedure
    .input(z.object({ profileName: z.string().max(20) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { userName: input.profileName },
      });

      if (user?.id === ctx.session.user.id) {
        return true;
      } else {
        return false;
      }
    }),

  searchUser: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      const users = ctx.db.user.findMany({
        where: {
          OR: [{ userName: { contains: input.query, mode: "insensitive" } }],
        },
      });
      return users;
    }),

  createRecentSearch: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const alreadyInRecentSearch = await ctx.db.searchHistory.findFirst({
        where: {
          targetUserId: input.targetUserId,
          userId: ctx.session.user.id,
        },
      });

      if (alreadyInRecentSearch) return;

      return ctx.db.searchHistory.create({
        data: {
          targetUserId: input.targetUserId,
          userId: ctx.session.user.id,
        },
      });
    }),

  updateUserProfileName: protectedProcedure
    .input(z.object({ profileName: z.string().max(20).min(3) }))
    .mutation(async ({ ctx, input }) => {
      const isUsernameExist = await ctx.db.user.findFirst({
        where: {
          userName: input.profileName,
        },
      });
      if (isUsernameExist) return null;
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          userName: input.profileName,
        },
      });
    }),

  followUser: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.follows.create({
        data: {
          followedById: ctx.session.user.id,
          followingId: input.targetUserId,
        },
      });
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.follows.delete({
        where: {
          followingId_followedById: {
            followedById: ctx.session.user.id,
            followingId: input.targetUserId,
          },
        },
      });
    }),

  getFollowers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.follows.findMany({
      where: { followedById: ctx.session.user.id },
      include: {
        following: {
          include: {
            posts: true,
            likes: true,
            Comments: true,
          },
        },
      },
    });
  })
});
