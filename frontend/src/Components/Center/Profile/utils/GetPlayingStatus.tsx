import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const apiAddress = import.meta.env.VITE_BACKEND;

function GetPlayingStatus(loginName: string) {
	const [isUserPlaying, setIsUserPlaying] = useState<boolean | null>(false);
	
	useEffect(() => {
		const socket = io(apiAddress, { transports: ["websocket"] });
		// const socket = new WebSocket('ws://localhost:3000'); // --> low level approach, without addition features

		// Request user playing status
		socket?.emit('requestPlayingStatus', loginName);
		
		// Event listener for status updates
		socket?.on('responsePlayingStatus', (response) => {
			console.log("Status isPlaying: ", response.isPlaying);
			setIsUserPlaying(response.isPlaying);
		});
		return () => {
			socket?.off('responsePlayingStatus');
			socket?.disconnect();
		};
	}, [] ); // No need to have socket as dependancy

	return isUserPlaying;
}

export default GetPlayingStatus;
