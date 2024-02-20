import {
  type Message,
  type ChatType,
  type ChatParticipant,
} from "@prisma/client";

export type GetAllChat = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: ChatType;
  messages: Message[];
  participants: ChatParticipant[];
}[];
