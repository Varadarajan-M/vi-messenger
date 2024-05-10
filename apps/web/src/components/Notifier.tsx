import useOnlineStatus from '@/hooks/common/useOnlineStatus';
import { useEffect } from 'react';
import { toast } from './ui/use-toast';

const Notifier = () => {
	const isOnline = useOnlineStatus();

	useEffect(() => {
		if (isOnline)
			toast({
				title: 'Online!',
				description: 'Hey! Welcome back online...',
				duration: 2000,
				variant: 'default',
				style: { backgroundColor: 'black', color: 'white', border: '1px solid purple' },
			});
		if (!isOnline)
			toast({
				title: 'Offline',
				description: 'Check your internet connection and try again.',
				duration: 2000,
				variant: 'destructive',
			});
	}, [isOnline]);

	return <></>;
};

export default Notifier;
