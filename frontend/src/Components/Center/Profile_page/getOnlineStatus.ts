import { useState, useEffect } from "react";
import { io } from "socket.io-client";

/*
	Real-time update of the displayed online status:
	When the parent component mounts, it calls this function, which opens the 
	socket connection and starts the 'listener'. At the detected change of status, 
	the callback function is triggered and updates the status variable 'isOnline'
*/

const apiAddress = import.meta.env.VITE_BACKEND;

interface StatusUpdateProps {
	isOnline: boolean;
}

// function getOnlineStatus(loginName: string) { 
export const getOnlineStatus = (loginName: string) => {
	console.log('GetOnlineStatus of: ', loginName);

	const [isUserOnline, setIsUserOnline] = useState<boolean | null>(false);

	// Function to be called when status change is detected
	const statusUpdateCallback = ({ isOnline }: StatusUpdateProps) => {
		setIsUserOnline(isOnline);
		console.log("     Status isOnline has changed: ", isOnline);
	}
	
	useEffect(() => {
		if (!loginName) return;

		try {
			const socket = io(apiAddress, { transports: ["websocket"] });
			
			// Request user playing status
			socket.on('responseOnlineStatus', statusUpdateCallback);
			socket.emit('requestOnlineStatus', loginName);
			
			return () => {
				socket.off('responseOnlineStatus');
				socket.disconnect();
			};
		} catch (error) {
			console.error("Socket initialization failed:", error);
		}
	}, [loginName] );

	console.log('     Is Online: ', isUserOnline);
	return isUserOnline;
}
