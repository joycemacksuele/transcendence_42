import { useState, useEffect } from "react";
import { chatSocket } from "../../Chat/Utils/ClientSocket";
// import { io } from "socket.io-client";

// const apiAddress = import.meta.env.VITE_BACKEND;

function GetPlayingStatus(loginName: string) {
	const [isUserPlaying, setIsUserPlaying] = useState<boolean | null>(false);
	
	useEffect(() => {
		//const socket = io(apiAddress, { transports: ["websocket"] });
		// const socket = new WebSocket('ws://localhost:3000'); // --> low level approach, without addition features
		try {
			if (!chatSocket.connected)
				chatSocket.connect();

			// Event listener for status updates
			chatSocket?.on('responsePlayingStatus', (response) => {
				console.log("Status isPlaying: ", response.isPlaying);
				setIsUserPlaying(response.isPlaying);
			});

			// Request user playing status
			chatSocket?.emit('requestPlayingStatus', loginName);
			
			return () => {
				chatSocket.off('connect_error');
				chatSocket.off('disconnect');
				chatSocket?.off('responsePlayingStatus');
				//socket?.disconnect();
			};
		} catch (error) {
			console.log('Error in GetPlayingStatus():');
		}
	}, [loginName] ); // No need to have socket as dependancy

	return isUserPlaying;
}

export default GetPlayingStatus;
