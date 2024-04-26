import { getSession } from '@/lib/auth';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext<ReturnType<typeof io> | null>(null);

const SocketContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const url =
		process.env.NODE_ENV === 'production'
			? 'https://vi-messenger.onrender.com'
			: 'http://localhost:5000';
	const [socket] = useState(() =>
		io(url, {
			auth: {
				token: `${getSession()?.token}`,
			},
		}),
	);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

export default SocketContextProvider;
