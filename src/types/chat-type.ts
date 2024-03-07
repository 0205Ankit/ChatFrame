import { type Message, type ChatType, type User } from "@prisma/client";

export type GetChat = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: ChatType;
  messages: Message[];
  name?: string;
  participants: {
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    chatId: string;
    isAdmin: boolean;
    user: User;
  }[];
};
