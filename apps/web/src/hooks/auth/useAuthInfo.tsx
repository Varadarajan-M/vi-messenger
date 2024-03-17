import { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

const useAuthInfo = () => {
	const ctx = useContext(AuthContext);

	if (!ctx) {
		throw new Error('useAuthInfo must be used within an AuthProvider');
	}

	return {
		isAuthenticated: ctx?.user?._id ? true : false,
		user: ctx?.user,
	};
};

export default useAuthInfo;
