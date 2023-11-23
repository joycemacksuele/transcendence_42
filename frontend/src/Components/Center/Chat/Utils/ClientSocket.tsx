import {io} from "socket.io-client";

export const chatSocket = io("http://localhost:3001", {
    transports: ['websocket'],
});// TODO GET FROM THE .ENV OR MACRO
console.log("[ClientSocket] Socket created: ", chatSocket.active);