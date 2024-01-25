import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { createPostSchema } from "@/schema/form-schema";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      // return ctx.db.post.create({
      //   data: {
      //     createdById: ctx.session.user.id,
      //     caption: input.caption,
      //     location: input.location,
      //     images: input.images,
      //     hideLikes: input.hideLikes,
      //     hideComments: input.hideComments,
      //   },
      // });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
});
