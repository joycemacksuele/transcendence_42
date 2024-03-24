import { useState, useEffect } from "react";
// import { io } from "socket.io-client";
import { chatSocket } from "../../Chat/Utils/ClientSocket.tsx";


/*
	Real-time update of the displayed online status:
	When the parent component mounts, it calls this function, which opens the 
	socket connection and starts the 'listener'. At the detected change of status, 
	the callback function is triggered and updates the status variable 'isOnline'.
	When the 'state' is updated via the 'setIsUserOnline', any component using this hook will 
	re-render.
*/

// const apiAddress = import.meta.env.VITE_BACKEND;

interface StatusUpdateProps {
	isOnline: boolean;
}

// function useOnlineStatus(loginName: string) { 
export const useOnlineStatus = (loginName: string) => {
	console.log('useOnlineStatus of: ', loginName);

	const [isUserOnline, setIsUserOnline] = useState<boolean | null>(false);

	// Function to be called when status change is detected
	const statusUpdateCallback = ( { isOnline }: StatusUpdateProps ) => {
		setIsUserOnline(isOnline);
		console.log("     Status isOnline has changed: ", isOnline);
	};

	const handleError = (error: Error) => {
		console.error("WebSocket error:", error);
		setIsUserOnline(null);
	};
	
	useEffect(() => {
		if (!loginName) return;

		try {
			// jaka: disabled io, trying to use the imported existing chatSocket
			// const socket = io(apiAddress, { transports: ["websocket"] });
			
			if (!chatSocket.connected)
				chatSocket.connect();
			
			chatSocket.on('responseOnlineStatus', statusUpdateCallback);
			chatSocket.on('connect_error', handleError);
			chatSocket.on('disconnect', (reason) => {
				console.error("WebSocket error:", reason);
				setIsUserOnline(null);
			})
			chatSocket.emit('requestOnlineStatus', loginName);
			
			return () => {
				chatSocket.off('connect_error');
				chatSocket.off('disconnect');
				chatSocket.off('responseOnlineStatus');
				// chatSocket.disconnect();		// Do not disconnect, because it is shared!
			};
		} catch (error) {
			console.error("Error in useOnlineStatus():", error);
		}
	}, [loginName] );

	console.log('     Is Online: ', isUserOnline);
	return isUserOnline;
}
