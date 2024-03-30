import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '@/components/auth/protected-route';

import AppPage from './pages/app';
import AuthPage from './pages/auth';

function App() {
	return (
		<Routes>
			<Route path='/u/*' element={<AuthPage />} />
			<Route path='/app' element={<ProtectedRoute />}>
				<Route index element={<AppPage />} />
			</Route>
			<Route path='*' element={<Navigate to='/u/login' replace />} />
		</Routes>
	);
}

export default App;
