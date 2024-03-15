import { createTRPCRouter, publicProcedure } from "Frontend/src/server/api/trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { customAlphabet } from "nanoid";

export const SignUpRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isUserExist = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (isUserExist) {
        throw new Error("user with this email already exists");
      }

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: bcrypt.hashSync(input.password, 10),

          accounts: {
            create: {
              provider: "email",
              type: "credentials",
              providerAccountId: customAlphabet("1234567890", 21)(),
            },
          },
        },
      });
      return user;
    }),
});
