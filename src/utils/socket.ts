import io from "socket.io-client";
const ENDPOINT = process.env.EXPRESS_SERVER_ENDPOINT ?? "";
const socket = io(ENDPOINT);
export default socket;
