import {io} from "socket.io-client";

export const chatSocket = io(import.meta.env.VITE_BACKEND as string, {
    transports: ['websocket'],
});
console.log("[ClientSocket] Socket created: ", chatSocket.active);
