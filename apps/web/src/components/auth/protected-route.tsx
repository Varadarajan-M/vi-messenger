import { Navigate, Outlet } from 'react-router-dom';

import useAuthInfo from '@/hooks/auth/useAuthInfo';

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuthInfo();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
