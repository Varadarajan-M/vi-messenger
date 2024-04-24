import { deleteUser, updatePassword, updateUsername } from '@/api/user';
import { toast } from '@/components/ui/use-toast';
import { useSocket } from '@/contexts/SocketContext';
import { useCallback, useState } from 'react';
import useAuth from '../auth/useAuth';
import useAuthInfo from '../auth/useAuthInfo';

const useModifyUser = () => {
	const { user } = useAuthInfo();
	const { setUser, resetUser } = useAuth();
	const [usernameLoading, setUsernameLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [deleteUserLoading, setDeleteUserLoading] = useState(false);

	const socket = useSocket();

	const handleEditUsername = useCallback(
		async (v: string) => {
			const value = v?.trim();
			setUsernameLoading(true);
			const res = (await updateUsername(value)) as { user: any };
			if (res?.user) {
				socket?.emit('username_update', res?.user?.username);
				setUser({ ...user, username: res?.user?.username } as any);
				toast({
					title: 'Username updated successfully',
					duration: 2000,
					variant: 'default',
					style: {
						background: 'black',
						border: '1px solid purple',
						color: 'white',
					},
				});
			} else {
				const error = (res as any)?.error;
				toast({
					title: 'Failed to update username',
					description: error,
					variant: 'destructive',
					duration: 2000,
				});
			}
			setUsernameLoading(false);
		},
		[setUser, socket, user],
	);

	const handleUpdatePassword = useCallback(async (v: string) => {
		const value = v?.trim();
		setPasswordLoading(true);
		const res = (await updatePassword(value)) as { user: any };
		if (res?.user) {
			toast({
				title: 'Password updated successfully',
				duration: 2000,
				variant: 'default',
				style: {
					background: 'black',
					border: '1px solid purple',
					color: 'white',
				},
			});
		} else {
			const error = (res as any)?.error;
			toast({
				title: 'Failed to update Password',
				description: error,
				variant: 'destructive',
				duration: 2000,
			});
		}
		setPasswordLoading(false);
	}, []);

	const handleDeleteUser = useCallback(async () => {
		setDeleteUserLoading(true);
		const res = (await deleteUser()) as any;

		if (res?.message) {
			toast({
				title: 'User deleted successfully',
				duration: 2000,
				variant: 'default',
				style: {
					background: 'black',
					border: '1px solid purple',
					color: 'white',
				},
			});

			setTimeout(resetUser, 2000);
		} else {
			toast({
				title: 'Failed to delete user',
				description: res?.error,
				variant: 'destructive',
				duration: 2000,
			});
		}
		setDeleteUserLoading(false);
	}, [resetUser]);

	return {
		usernameLoading,
		passwordLoading,
		deleteUserLoading,
		handleEditUsername,
		handleUpdatePassword,
		handleDeleteUser,
	};
};

export default useModifyUser;
