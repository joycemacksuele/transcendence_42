import { Dispatch, SetStateAction, RefObject } from "react";
// import { io } from "socket.io-client";
import { chatSocket } from "../../Chat/Utils/ClientSocket.tsx";
import { User } from "../../Users/DisplayUsers";

/*
	Getting real-time updates of the displayed online statuses.
*/

const handleError = (error: Error) => {
	console.error("There was a WebSocket connect-error:", error);
};

const applyStatusUpdates = (
	updates: string[],
	usersRef: RefObject<User[]>,
	setUsers: Dispatch<SetStateAction<User[]>>
) => {
	// console.log('       applyStatusUpdates(), ' + 'usersRef.current: ' + usersRef.current);
	if (usersRef.current) {
		const updatedUsers = usersRef.current.map(user => {
			const isOnline: boolean = updates.includes(user.loginName);
			// console.log('      user [' + user.loginName + '] ' + "online:" + isOnline);
			return { ...user, onlineStatus: isOnline };
		});
		// console.log('[applyStatusUpdates] > > > > > > > > > > > > > > > ');
		setUsers(updatedUsers);
	}
};


export const getOnlineStatusUpdates = (
	usersRef: RefObject<User[]>,
	setUsers: Dispatch<SetStateAction<User[]>>
) => {
	// console.log('       getOnlineStatuses(), usersRef ; ' + usersRef);
	try {
		if (!chatSocket.connected)
			chatSocket.connect();
		
		const wrappedApplyStatusUpdates =
			(updates: string[]) => applyStatusUpdates(updates, usersRef, setUsers);

		chatSocket.on('onlineStatusUpdates', wrappedApplyStatusUpdates);
		chatSocket.on('connect_error', handleError);
		chatSocket.on('disconnect', (reason) => {
			console.error("There was a WebSocket disconnect error:", reason);
		});

		return (	// Return a cleanup function
			() => {
				chatSocket.off('connect_error');
				chatSocket.off('disconnect');
				chatSocket.off('onlineStatusUpdates', wrappedApplyStatusUpdates); 
				//chatSocket.disconnect();
			}
		)
	} catch (error) {
		console.error("Error in getOnlineStatusUpdates():", error);
	}
}
