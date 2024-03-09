import { Dispatch, SetStateAction, RefObject } from "react";
import { io } from "socket.io-client";
import { User } from "./DisplayUsers";

/*
	Getting real-time updates of the displayed online statuses.
*/

const backendURL = import.meta.env.VITE_BACKEND;


const applyStatusUpdates = (
	updates: string[],
	usersRef: RefObject<User[]>,
	setUsers: Dispatch<SetStateAction<User[]>>
) => {
	if (usersRef.current) {
		const updatedUsers = usersRef.current.map(user => {
			// Attempt to find a matching update for the current user:
			// const update = updates.find(update => update === user.loginName);
			// return update ? { ...user, onlineStatus: true }
						// : 
						// { ...user, onlineStatus: false};
			const isOnline = updates.includes(user.loginName);
			console.log('      user [', user.loginName, '] ', isOnline);
			return { ...user, onlineStatus: isOnline };
		});
		setUsers(updatedUsers);
	}
};


export const getOnlineStatusUpdates = (
	usersRef: RefObject<User[]>,
	setUsers: Dispatch<SetStateAction<User[]>>
) => {
	const socket = io(backendURL, { transports: ['websocket'] });

	const wrappedApplyStatusUpdates =
		(updates: string[]) => applyStatusUpdates(updates, usersRef, setUsers);

	socket.on('onlineStatusUpdates', wrappedApplyStatusUpdates);

	return (	// Return a cleanup function
		() => {
			socket.off('onlineStatusUpdates', wrappedApplyStatusUpdates); 
			socket.disconnect();
		}
	)
}
