import { prisma } from "../prisma";
import { type Request, type Response } from "express";

interface CustomRequest extends Request {
  body: {
    userId: string;
  };
}

export default class ChatController {
  static getChats = async (req: CustomRequest, res: Response) => {
    const { userId } = req.body;
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
      res.status(200).send({ ...chats });
      return;
    } catch (err) {
      console.log(err);
      return res.status(500).send(null);
    }
  };
}
