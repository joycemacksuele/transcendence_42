import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";


const apiAddress = import.meta.env.VITE_BACKEND;

interface GetPlayingStatusProps {
	loginName: string;
}

// ingame or empty string
// online or empty string

function GetPlayingStatus({ loginName }: GetPlayingStatusProps) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isUserPlaying, setIsUserPlaying] = useState("");
	useEffect(() => {

	if (!socket) {
		const newSocket = io(apiAddress, { transports: ["websocket"] });
		setSocket(newSocket);
	}

		// Request user playing status
		socket?.emit('requestPlayingStatus', loginName);
		
		// Listen for status updates
		socket?.on('responsePlayingStatus', (response) => {
			console.log("Status isPlaying: ", response.isPlaying);
			if (response.loginName === loginName) {	// this maybe is not necessary, since we already know that this is the user.
				setIsUserPlaying(response.isPlaying);
			}
		});
		socket?.on('sendPlayingStatusToAll', (response, status: string) => {
			if (response.loginName === loginName) {
				if (status === "") {
					console.log("User has stopped playing -- > change status to empty string (not in game)");
					setIsUserPlaying(status);
				}
			}
		})
		return () => {
			socket?.off('responsePlayingStatus');
		};
	}, [socket] );	// Can it be without socket here Because it wont change


	return (
		<>
			{isUserPlaying ? "Yes" : "No"}
		</>
	);
}

export default GetPlayingStatus;