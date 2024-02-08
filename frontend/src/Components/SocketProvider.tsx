// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

// const backendAddress = import.meta.env.VITE_BACKEND;
// const SocketContext = createContext(null);

// NOT SURE IF THIS IS ALL OK, 
// MAYBE IT CAN BE WITHOUT DefaultEventsMap , ETC ...



// export const useSocket = () => useContext(SocketContext);

// interface SocketProviderProps {
// 	children : React.ReactNode;
// }

// export const SocketProvider = ({ children }: SocketProviderProps) => {
// 	const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

// 	useEffect(() => {
// 		const newSocket: Socket<DefaultEventsMap, DefaultEventsMap> = io(backendAddress, { transports: ['websocket'] });
// 		setSocket(newSocket);

// 		return () => newSocket.disconnect();
// 	}, []);

// 	return (
// 		<SocketContext.Provider value={socket}>
// 			{children}
// 		</SocketContext.Provider>
// 	);
// };