import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const user = ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
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
});
