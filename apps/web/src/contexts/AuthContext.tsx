import React, { PropsWithChildren, useState } from 'react';

import { getSession } from '@/lib/auth';
import { User } from '@/types/auth';

interface AuthContextProps {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = React.createContext<AuthContextProps | null>(null);

const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(getSession);
	return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
