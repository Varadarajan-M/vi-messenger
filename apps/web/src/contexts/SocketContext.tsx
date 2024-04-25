import { getSession } from '@/lib/auth';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext<ReturnType<typeof io> | null>(null);

const SocketContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [socket] = useState(() =>
		io('https://vi-messenger.onrender.com', {
			auth: {
				token: `${getSession()?.token}`,
			},
		}),
	);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

export default SocketContextProvider;
