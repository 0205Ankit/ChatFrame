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

  createChat: protectedProcedure
    .input(
      z.object({
        type: z.enum(["ONE_TO_ONE", "GROUP"]),
        participantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { type, participantId } = input;

      const totalParticipants = [participantId, ctx.session.user.id];

      if (totalParticipants.length < 2) {
        throw new Error("Cannot create a chat without participants.");
      }

      const chatTransaction = await ctx.db.$transaction(async () => {
        const existingChat = await ctx.db.chat.findFirst({
          where: {
            participants: {
              every: {
                userId: {
                  in: totalParticipants,
                },
              },
            },
          },
        });

        if (existingChat) return existingChat;

        const chat = await ctx.db.chat.create({
          data: {
            type,
          },
        });

        await ctx.db.chatParticipant.createMany({
          data: totalParticipants.map((participantId) => ({
            chatId: chat.id,
            userId: participantId,
            isAdmin: true,
          })),
        });

        return chat;
      });

      return chatTransaction;
    }),

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
          isReadByReciever: false,
        },
        data: {
          isReadByReciever: true,
        },
      });
    }),

  updateMessageReaction: protectedProcedure
    .input(
      z.object({
        messageId: z.string(),
        reaction: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.message.update({
        where: {
          id: input.messageId,
        },
        data: {
          reaction: input.reaction,
        },
      });
    }),
});
