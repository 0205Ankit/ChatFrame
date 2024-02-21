import { prisma } from "../prisma";
import { type Request, type Response } from "express";

interface CreateMessageRequest extends Request {
  body: {
    senderId: string;
    chatId: string;
    text: string;
  };
}

export default class MessagesController {
  static createMessage = async (req: CreateMessageRequest, res: Response) => {
    const { text, senderId, chatId } = req.body;
    try {
      const message = await prisma.message.create({
        data: {
          text,
          senderId,
          chatId,
        },
      });
      res.status(200).send(message);
      return;
    } catch (err) {
      console.log(err);
      return res.status(500).send(null);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////
  static getMessagesByChatId = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    try {
      const messages = await prisma.message.findMany({
        where: {
          chatId,
        },
      });
      res.status(200).send(messages);
    } catch (err) {
      console.log(err);
      return res.status(500).send(null);
    }
  };
}
