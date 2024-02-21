/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import MessagesController from "./messages.controller";

const messagesRouter = Router();

messagesRouter.post("/create", MessagesController.createMessage);
messagesRouter.get("/:chatId", MessagesController.getMessagesByChatId);

export default messagesRouter;
