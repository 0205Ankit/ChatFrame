import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT ?? 3333;
const app = express();
const server = createServer(app);
const corsConfig = {
  origin: "https://chat-frame.vercel.app", // TODO: remove hard coded value
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());

const io = new Server(server, {
  pingTimeout: 60000, // what is a pong packet?
  cors: corsConfig,
});
// app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

app.get("/", (req, res) => {
  res.send("Hello!");
});

io.on("connection", (socket) => {
  socket.on("setup", (userData: { id: string }) => {
    void socket.join(userData.id);
    socket.data = {
      userId: userData.id,
    };
    socket.emit("connected");
  });

  socket.on("join chat", (room: string) => {
    void socket.join(room);
    void socket.in(room).emit("joined chat", room);
  });

  socket.on("typing", (room: string) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop typing", (room: string) => {
    socket.in(room).emit("stop typing", room);
  });

  socket.on("new message", (room: string) => {
    socket.in(room).emit("message received", room);
  });

  socket.on("any new message", () => {
    socket.emit("any new message received");
  });

  socket.off("setup", (userData: { id: string }) => {
    console.log("USER DISCONNECTED");
    void socket.leave(userData.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
