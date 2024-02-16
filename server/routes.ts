import { Router } from "express";
import chatRouter from "./chat/chat.routes";

const globalRouter = Router();

globalRouter.use("/chat", chatRouter);

export default globalRouter;
