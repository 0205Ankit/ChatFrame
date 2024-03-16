import { createTRPCRouter, protectedProcedure } from "../trpc";
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
        participantId: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { type, participantId } = input;

      const totalParticipants = [...participantId, ctx.session.user.id];

      if (totalParticipants.length < 2) {
        throw new Error("Cannot create a chat without participants.");
      }

      const chatTransaction = await ctx.db.$transaction(async () => {
        if (type === "ONE_TO_ONE") {
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
        }

        const chat = await ctx.db.chat.create({
          data: {
            type,
          },
        });

        await ctx.db.chatParticipant.createMany({
          data: totalParticipants.map((participantId) => ({
            chatId: chat.id,
            userId: participantId,
            isAdmin:
              type === "GROUP" ? participantId === ctx.session.user.id : true,
          })),
        });

        return chat;
      });

      return chatTransaction;
    }),

  getChats: protectedProcedure.query(({ ctx }) => {
    return ctx.db.chat.findMany({
      where: {
        participants: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
        messages: true,
      },
    });
  }),

  getOnlyChatIds: protectedProcedure.query(({ ctx }) => {
    return ctx.db.chat.findMany({
      where: {
        participants: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }),

  getTotalUnreadChats: protectedProcedure.query(async ({ ctx }) => {
    const chats = await ctx.db.chat.findMany({
      where: {
        participants: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    const getTotalUnreadChats = chats?.filter((chat) => {
      return (
        chat.messages.length > 0 &&
        !chat.messages[chat.messages.length - 1]?.isReadByRecievers.includes(
          ctx.session.user.id,
        )
      );
    }).length;

    return getTotalUnreadChats;
  }),

  getChatsById: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findUnique({
        where: {
          id: input.chatId,
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
          messages: true,
        },
      });

      if (
        chat?.participants.some(
          (participant) => participant.userId === ctx.session.user.id,
        )
      ) {
        return chat;
      }
      return null;
    }),

  updateChatName: protectedProcedure
    .input(z.object({ chatId: z.string(), name: z.string().max(15) }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.update({
        where: {
          id: input.chatId,
          type: "GROUP",
        },
        data: {
          name: input.name,
        },
      });
      return chat;
    }),

  removeParticipantFromChat: protectedProcedure
    .input(z.object({ chatId: z.string(), participantId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.update({
        where: {
          id: input.chatId,
          type: "GROUP",
        },
        data: {
          participants: {
            delete: {
              userId_chatId: {
                userId: input.participantId,
                chatId: input.chatId,
              },
            },
          },
        },
      });
      return chat;
    }),

  addParticipantToChat: protectedProcedure
    .input(
      z.object({ chatId: z.string(), participantIds: z.array(z.string()) }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.update({
        where: {
          id: input.chatId,
          type: "GROUP",
        },
        data: {
          participants: {
            createMany: {
              data: input.participantIds.map((participantId) => ({
                userId: participantId,
                isAdmin: false,
              })),
            },
          },
        },
      });
      return chat;
    }),
});
