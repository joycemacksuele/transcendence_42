import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

const apiAddress = import.meta.env.VITE_BACKEND;

// interface GetPlayingStatusProps {
// 	loginName: string;
// }



function GetOnlineStatus(loginName: string) {
	console.log('GetOnlineStatus of: ', loginName);

	const [isUserOnline, setIsUserOnline] = useState<boolean | null>(false);
	
	useEffect(() => {
		const socket = io(apiAddress, { transports: ["websocket"] });

		// Request user playing status
		socket?.emit('requestOnlineStatus', loginName);
		
		// Event listener for status updates
		socket?.on('responseOnlineStatus', ({ isOnline }) => {
			console.log("Status isOnline: ", isOnline);
			setIsUserOnline(isOnline);
		});
		return () => {
			socket?.off('responseOnlineStatus');
			socket?.disconnect();
		};
	}, [loginName] ); // No need to have socket as dependancy
	console.log('Is Online: ', isUserOnline);
	return isUserOnline;
}

export default GetOnlineStatus;
