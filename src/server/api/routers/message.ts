import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        senderId: z.string(),
        chatId: z.string(),
        isReadByRecievers: z.array(z.string()).optional(),
        replyToMessageId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.message.create({
        data: {
          text: input.text,
          senderId: input.senderId,
          chatId: input.chatId,
          isReadByRecievers: input.isReadByRecievers ?? [],
          ...(!!input.replyToMessageId && {
            repliedToMessageId: input.replyToMessageId,
          }),
        },
        include: {
          chat: {
            include: {
              participants: true,
            },
          },
          sender: true,
        },
      });
    }),
  //////////////////////////////////////////////////

  getMessagesByChatId: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.message.findMany({
        where: {
          chatId: input.chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          chat: {
            include: {
              participants: true,
            },
          },
          sender: true,
          repliedToMessage: {
            include: {
              sender: true,
            },
          },
        },
      });
    }),
  //////////////////////////////////////////////////
  unreadMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.message.updateMany({
        where: {
          chatId: input.chatId,
          NOT: {
            isReadByRecievers: {
              has: ctx.session.user.id,
            },
          },
        },
        data: {
          isReadByRecievers: {
            push: ctx.session.user.id,
          },
        },
      });
    }),
});
