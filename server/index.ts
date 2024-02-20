import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import globalRouter from "./routes";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app);
const corsConfig = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new Server(server, {
  pingTimeout: 60000, // what is a pong packet?
  cors: corsConfig,
});
app.use(cors(corsConfig));
app.use(express.json());
app.use("/api", globalRouter);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});