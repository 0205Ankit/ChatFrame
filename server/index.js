"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({
    path: "./.env",
});
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3333;
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const corsConfig = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.use(express_1.default.json());
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000, // what is a pong packet?
    cors: corsConfig,
});
// app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`
app.get("/", (req, res) => {
    res.send("Hello!");
});
io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        void socket.join(userData.id);
        socket.data = {
            userId: userData.id,
        };
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        void socket.join(room);
        void socket.in(room).emit("joined chat", room);
    });
    socket.on("typing", (room) => {
        socket.in(room).emit("typing", room);
    });
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing", room);
    });
    socket.on("new message", (room) => {
        socket.in(room).emit("message received", room);
    });
    socket.on("any new message", () => {
        socket.emit("any new message received");
    });
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        void socket.leave(userData.id);
    });
});
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
