import { User } from '@/types/auth';

export const AUTH_FORM_VALIDATIONS = {
	username: {
		required: 'Username is required',
		minLength: {
			value: 3,
			message: 'Username must be at least 3 characters',
		},
		maxLength: {
			value: 20,
			message: 'Username must be less than 20 characters',
		},
	},
	email: {
		required: 'Email is required',
		pattern: {
			value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
			message: 'Invalid email address',
		},
	},
	password: {
		required: 'Password is required',
		minLength: {
			value: 8,
			message: 'Password must be at least 8 characters',
		},
		maxLength: {
			value: 20,
			message: 'Password must be less than 20 characters',
		},
		pattern: {
			value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
			message:
				'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
		},
	},
};

export const getSession = (): User | null => {
	const session = window.localStorage.getItem('session');
	if (!session) {
		return null;
	}
	return JSON.parse(session) ?? null;
};

export const setSession = (session: User) => {
	window.localStorage.setItem('session', JSON.stringify(session));
};
