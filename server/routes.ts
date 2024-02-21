import { Router } from "express";
import chatRouter from "./chat/chat.routes";
import messagesRouter from "./messages/messages.routes";

const globalRouter = Router();

globalRouter.use("/chat", chatRouter);
globalRouter.use("/messages", messagesRouter);

export default globalRouter;
