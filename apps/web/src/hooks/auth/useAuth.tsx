import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

import { login, register } from '@/api/auth';
import { setSession } from '@/lib/auth';
import { AuthFormData } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
	const ctx = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogin = useCallback(
		async (data: Omit<AuthFormData, 'username'>) => {
			try {
				const res = (await login(data)) as any;
				if (!res.error) {
					ctx?.setUser(res);
					setSession(res);
					navigate('/');
				} else {
					alert(res.error);
				}
			} catch (error) {
				console.log(error);
			}
		},
		[ctx, navigate],
	);

	const handleRegister = useCallback(async (data: AuthFormData) => {
		try {
			const res = (await register(data)) as any;
			if (!res.error) {
				console.log(res);
			} else {
				alert(res.error);
			}
		} catch (error) {
			console.log(error);
		}
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
