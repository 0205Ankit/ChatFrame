import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
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

  getAllPostOfUser: protectedProcedure.query(({ ctx }) => {
    const posts = ctx.db.post.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: { comments: true, likes: true },
    });
    return posts;
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
});
