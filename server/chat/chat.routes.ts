/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import ChatController from "./chat.controller";

const chatRouter = Router();

chatRouter.get("/", ChatController.getChats);
chatRouter.get("/:chatId", ChatController.getChatsByChatId);

export default chatRouter;
