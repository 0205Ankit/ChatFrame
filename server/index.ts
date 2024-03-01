import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
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
};

const io = new Server(server, {
  pingTimeout: 60000, // what is a pong packet?
  cors: corsConfig,
});
// app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

app.use(cors(corsConfig));
app.use(express.json());

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
    // const userIdsInRoom = [] as string[];
    void socket.join(room);
    // const socketsInRoom = io.sockets.adapter.rooms.get(room);
    // if (socketsInRoom) {
    //   socketsInRoom.forEach((socketId) => {
    //     const userSocket = io.sockets.sockets.get(socketId) as CustomSocket;
    //     userIdsInRoom.push(userSocket?.data.userId);
    //   });
    // }
    // console.log(room, userIdsInRoom);
    void socket.in(room).emit("joined chat", room);
  });

  socket.on("typing", (room: string) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop typing", (room: string) => {
    socket.in(room).emit("stop typing", room);
  });

  socket.on("new message", (room: string) => {
    socket.in(room).emit("message recieved", room);
  });

  socket.off("setup", (userData: { id: string }) => {
    console.log("USER DISCONNECTED");
    void socket.leave(userData.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
