import { getSession } from '@/lib/auth';
import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { io } from 'socket.io-client';

// const SocketContext = createContext<ReturnType<io>>(null)

const SocketContext = createContext<ReturnType<typeof io> | null>(null);

const SocketContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [socket] = useState(() =>
		io('http://localhost:5000', {
			auth: {
				token: `${getSession()?.token}`,
			},
		}),
	);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);

export default SocketContextProvider;
