import { Router } from "express";
import ChatController from "./chat.controller";

const chatRouter = Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
chatRouter.get("/", ChatController.getChats);

export default chatRouter;
