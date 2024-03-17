import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

import { AuthFormData } from '@/types/auth';

const useAuth = () => {
	const ctx = useContext(AuthContext);

	const handleLogin = useCallback((data: Omit<AuthFormData, 'username'>) => {
		// TODO: implement login
		console.log(data);
	}, []);

	const handleRegister = useCallback((data: AuthFormData) => {
		// TODO: implement register
		console.log(data);
	}, []);

	const resetUser = useCallback(() => {
		ctx?.setUser(null);
	}, [ctx]);

	if (!ctx) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return {
		handleLogin,
		handleRegister,
		resetUser,
	};
};

export default useAuth;
