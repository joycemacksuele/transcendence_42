import {io} from "socket.io-client";

export const chatSocket = io(import.meta.env.VITE_BACKEND, {
    transports: ['websocket'],
});// TODO GET FROM THE .ENV OR MACRO
console.log("[ClientSocket] Socket created: ", chatSocket.active);
