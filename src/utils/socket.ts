import io from "socket.io-client";
const ENDPOINT =
  process.env.EXPRESS_SERVER_ENDPOINT ??
  "https://chat-frame-server.vercel.app/"; /// TODO: don't hardcode the server url
const socket = io(ENDPOINT);
export default socket;
