import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { MsgType } from "@prisma/client";
import { z } from "zod";

export const messagesRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        senderId: z.string(),
        chatId: z.string(),
        isReadByRecievers: z.array(z.string()).optional(),
        replyToMessageId: z.string().optional(),
        type: z.nativeEnum(MsgType).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.message.create({
        data: {
          content: input.content,
          senderId: input.senderId,
          chatId: input.chatId,
          isReadByRecievers: input.isReadByRecievers
            ? [...input.isReadByRecievers, input.senderId]
            : [input.senderId],

          ...(!!input.replyToMessageId && {
            repliedToMessageId: input.replyToMessageId,
          }),
          type: input.type ?? "TEXT",
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
  //////////////////////////////////////////////////
  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.message.delete({
        where: {
          id: input.messageId,
        },
      });
    }),
});
