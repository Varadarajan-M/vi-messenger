import Login from '@/components/auth/login';
import Register from '@/components/auth/register';
import { Route, Routes } from 'react-router-dom';

const AuthPage = () => {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />

			<Route path='*' element={<Login />} />
		</Routes>
	);
};

export default AuthPage;
