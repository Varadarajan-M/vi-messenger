import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '@/components/auth/login';
import Register from '@/components/auth/register';
import useAuthInfo from '@/hooks/auth/useAuthInfo';

const AuthPage = () => {
	const { isAuthenticated } = useAuthInfo();

	if (isAuthenticated) {
		return <Navigate to='/app' replace />;
	}

	return (
		<Routes>
			<Route path='login' element={<Login />} />
			<Route path='register' element={<Register />} />
			<Route path='*' element={<Login />} />
		</Routes>
	);
};

export default AuthPage;
