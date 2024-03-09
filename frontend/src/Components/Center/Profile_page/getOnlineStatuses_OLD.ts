import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { io } from "socket.io-client";
import { User } from "./DisplayUsers";

/*
	Real-time update of the displayed online statuses:
*/


const backendURL = import.meta.env.VITE_BACKEND;

/*
  Callback function, to be passed to getOnlineStatuses()
    It will be triggered when a status change is detected on backend,
    so it sets the new state in setUsers() --> it updates the variable 'onlineStatus' - (but it does not yet update it in the database - it should be done separately).
    The 'updates' is the returned array from backend, it holds all current online users. 
      - find() finds if a user ID is in the websockets returned array
      - map() returns the array of users, but with updated onlineStatus variables
      - setUsers() updates the array of previously fetched users  
*/
export const processStatusUpdates = (updates: string[],
									 users: User[],
									 setUsers: Dispatch<SetStateAction<User[]>>) => {
	const updatedUsers = users.map(user => {

		// Attempt to find a matching update for the current user:
		const update = updates.find(update => update === user.loginName);

		// If an update is found, apply it to the user's online status
		return update ? { ...user, onlineStatus: true }
						: 
						{ ...user, onlineStatus: false};
	});
	// Update the state with the new array of updated users
	setUsers(updatedUsers);
};

// interface UserOnlineStatuses {
// 	id: string;		// this is loginName (from jwt token)
// 	isOnline: boolean;
// }
/*
	getOnlineStatuses():
	It receives one arg --> the function processStatusUpdates(), which is defined in
	the parent, outside useEffect, and performs find(), map() and setUsers().
	'updates' is the array of online users, returned from websocket endpoint.
	It returns the 'cleanup' function, which becomes the 'unsibscribe' variable in the 
	parent usEffect() function, which cleans the socket at the unmount.
*/
export const getOnlineStatuses = (processStatusUpdatesXXX: (updates: string[]) => void) => {
	console.log('GetOnlineStatuses: ');

	const socket = io(backendURL, { transports: ['websocket'] });

	// Function to be called when status change is detected
	// The ws endpoint returns 
	// The updates[] will now contain all online users (id and status)
	// Also, the previously fetched users[] will be updated (onlineStatus) 
	// const onlineStatusCallback = 
	// 	(updates: UserOnlineStatuses[]) => { processStatusUpdates(updates); };

	socket.on('onlineStatusUpdates', processStatusUpdatesXXX);

	// return a cleanup function:
	return () => {
		socket.off('onlineStatusUpdates', processStatusUpdatesXXX)
		socket.disconnect();
	}

}
