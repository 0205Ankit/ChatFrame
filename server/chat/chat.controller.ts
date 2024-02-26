import { prisma } from "../prisma";
import { type Request, type Response } from "express";

interface GetChatsRequest extends Request {
  query: {
    userId: string;
  };
}

interface GetChatsByChatId extends Request {
  params: {
    chatId: string;
  };
}

export default class ChatController {
  static getChats = async (req: GetChatsRequest, res: Response) => {
    const { userId } = req.query;
    try {
      const chats = await prisma.chat.findMany({
        where: {
          participants: {
            some: {
              userId,
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
      // const filteredChats = chats.filter((chat) => {
      //   return chat.participants.some((participant) => {
      //     return participant.userId === userId;
      //   });
      // });

      // const sortedChats =
      //   chats.length > 1
      //     ? chats.sort((a, b) => {
      //         return (
      //           new Date(
      //             b.messages[b.messages.length - 1]?.createdAt,
      //           ).getTime() -
      //           new Date(a.messages[a.messages.length - 1]?.createdAt).getTime()
      //         );
      //       })
      //     : chats;

      res.status(200).send(chats);
      return;
    } catch (err) {
      console.log(err);
      return res.status(500).send(null);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////
  static getChatsByChatId = async (req: GetChatsByChatId, res: Response) => {
    const { chatId } = req.params;
    try {
      const chat = await prisma.chat.findUnique({
        where: {
          id: chatId,
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
      res.status(200).send(chat);
    } catch (err) {
      console.log(err);
      return res.status(500).send(null);
    }
  };
}
