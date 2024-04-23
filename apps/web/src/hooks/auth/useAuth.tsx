import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

import { login, register } from '@/api/auth';
import { toast } from '@/components/ui/use-toast';
import { clearSession, setSession } from '@/lib/auth';
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
					toast({
						description: res?.error,
						duration: 2000,
						variant: 'destructive',
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		[ctx, navigate],
	);

	const handleRegister = useCallback(
		async (data: AuthFormData) => {
			try {
				const res = (await register(data)) as any;
				if (!res.error) {
					toast({
						description: 'Registration Successful',
						duration: 2000,
						variant: 'default',
						className: 'bg-black text-white',
					});
					navigate('/u/login');
				} else {
					toast({
						title: 'Registration Failed',
						description: res.error,
						duration: 2000,
						variant: 'destructive',
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		[navigate],
	);

	const resetUser = useCallback(() => {
		ctx?.setUser(null);
		clearSession();
		navigate('/login', { replace: true });
	}, [ctx, navigate]);

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
