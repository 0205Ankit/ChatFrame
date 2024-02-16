import { prisma } from "../prisma";
import { type Request, type Response } from "express";

export default class ChatController {
  static getChats = async (req: Request, res: Response) => {
    const chats = await prisma.chat.findMany();
    res.status(200).send({ chats });
    return;
  };
}
