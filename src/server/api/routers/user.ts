import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    const user = ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
    return user;
  }),
});
