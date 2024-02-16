import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  getRecentChat: protectedProcedure.query(({ ctx }) => {
    return ctx.db.chat.findMany({
      where: {
        participants: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });
  }),
});
