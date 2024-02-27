import { useState, useEffect } from "react";
import { io } from "socket.io-client";

/*
	Real-time update of the displayed online statuses:
*/


const backendURL = import.meta.env.VITE_BACKEND;

interface UserOnlineStatuses {
	id: number;
	isOnline: boolean;
}
/*
	getOnlineStatuses():
	It receives one arg --> the function processStatusUpdates(), which is defined in
	the parent, outside useEffect, and performs find(), map() and setUsers().
	'updates' is the array of online users, returned from websocket endpoint.
	It returns the 'cleanup' function, which becomes the 'unsibscribe' variable in the 
	parent usEffect() function, which cleans the socket at the unmount.
*/
export const getOnlineStatuses = (processStatusUpdates: (updates: UserOnlineStatuses[]) => void) => {
	console.log('GetOnlineStatuses: ');

	const socket = io(backendURL, { transports: ['websocket'] });

	// Function to be called when status change is detected
	// The ws endpoint returns 
	// The updates[] will now contain all online users (id and status)
	// Also, the previously fetched users[] will be updated (onlineStatus) 
	const onlineStatusCallback = 
		(updates: UserOnlineStatuses[]) => { processStatusUpdates(updates); };

	socket.on('requestOnlineStatuses', onlineStatusCallback);

	// return a cleanup function:
	return () => {
		socket.off('requestOnlineStatuses', onlineStatusCallback)
		socket.disconnect();
	}

}
