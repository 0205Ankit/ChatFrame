import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const searchRouter = createTRPCRouter({
  getRecentSearch: protectedProcedure.query(({ ctx }) => {
    return ctx.db.searchHistory.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        targetUser: {
          select: {
            userName: true,
            profilePhoto: true,
            id: true,
          },
        },
      },
    });
  }),

  deleteRecentSearch: protectedProcedure
    .input(z.object({ targetUserId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.searchHistory.delete({
        where: {
          userId_targetUserId: {
            targetUserId: input.targetUserId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  deleteAllRecentSearch: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.searchHistory.deleteMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
