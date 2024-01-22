import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";


const apiAddress = import.meta.env.VITE_BACKEND;

interface GetPlayingStatusProps {
	loginName: string;
}


function GetPlayingStatus({ loginName }: GetPlayingStatusProps) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isUserPlayin, setIsUserPlaying] = useState(false);
	useEffect(() => {

	if (!socket) {
		const newSocket = io(apiAddress, { transports: ["websocket"] });
		setSocket(newSocket);
	}

		// Request user playing status
		socket?.emit('requestPlayingStatus', loginName);
		
		// Listen for status updates
		socket?.on('responsePlayingStatus', (response) => {
			if (response.loginName === loginName) {
				setIsUserPlaying(response.isPlaying);
			}
		});
		
		return () => {
			socket?.off('responsePlayingStatus');
		};
	}, [loginName, socket] );


	return (
		<div>
			{isUserPlayin ? "Currently playing" : "Not playing"}
		</div>
	);
}

export default GetPlayingStatus;