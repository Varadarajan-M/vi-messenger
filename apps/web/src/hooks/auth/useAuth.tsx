import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

import { login, register } from '@/api/auth';
import { toast } from '@/components/ui/use-toast';
import { clearSession, setSession } from '@/lib/auth';
import { getTextAvatar } from '@/lib/utils';
import { AuthFormData, User } from '@/types/auth';
import { useChatsStore, useMessageStore } from '@/zustand/store';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
	const ctx = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogin = useCallback(
		async (data: Omit<AuthFormData, 'username'>) => {
			try {
				const res = (await login(data)) as any;
				if (!res.error) {
					const pic = res?.picture ?? getTextAvatar(res?.username);
					const user = { ...res, picture: pic };
					ctx?.setUser(user);
					setSession(user);
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
		useMessageStore.setState(useMessageStore.getInitialState());
		useChatsStore.setState(useChatsStore.getInitialState());
		navigate('/login', { replace: true });
	}, [ctx, navigate]);

	const setUser = (user: User | null) => {
		if (!user) return;
		ctx?.setUser(user);
		setSession(user);
	};

	if (!ctx) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return {
		handleLogin,
		handleRegister,
		resetUser,
		setUser: setUser,
	};
};

export default useAuth;
