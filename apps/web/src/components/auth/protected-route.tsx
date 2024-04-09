import { Navigate, Outlet } from 'react-router-dom';

import SocketContextProvider from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuthInfo();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return (
		<SocketContextProvider>
			<Outlet />
		</SocketContextProvider>
	);
};

export default ProtectedRoute;
