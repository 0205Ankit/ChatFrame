import io from "socket.io-client";
// const ENDPOINT = process.env.EXPRESS_SERVER_ENDPOINT ?? "";
const socket = io("https://chat-frame-server-three.vercel.app"); /// TODO: remove hard coded value
export default socket;
