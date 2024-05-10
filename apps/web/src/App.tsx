import { Fragment } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '@/components/auth/protected-route';
import { Toaster } from './components/ui/toaster';

import Notifier from './components/Notifier';
import AppPage from './pages/app';
import AuthPage from './pages/auth';

function App() {
	return (
		<Fragment>
			<Routes>
				<Route path='/u/*' element={<AuthPage />} />
				<Route path='/app' element={<ProtectedRoute />}>
					<Route index element={<AppPage />} />
				</Route>
				<Route path='*' element={<Navigate to='/u/login' replace />} />
			</Routes>
			<Notifier />
			<Toaster />
		</Fragment>
	);
}

export default App;
