import io from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_EXPRESS_SERVER_ENDPOINT ?? "";
const socket = io(ENDPOINT);
export default socket;
