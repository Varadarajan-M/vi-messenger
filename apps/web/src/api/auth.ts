import api from '@/lib/axios';
import { AuthFormData } from '@/types/auth';

export const login = async (data: Omit<AuthFormData, 'username'>) => {
	try {
		const res = await api.post('/auth/login', data);
		return res;
	} catch (err: unknown) {
		console.log(err);
		return err;
	}
};

export const register = async (data: AuthFormData) => {
	try {
		const res = await api.post('/auth/register', data);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};
