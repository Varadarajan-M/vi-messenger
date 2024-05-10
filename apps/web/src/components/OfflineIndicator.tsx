import { Button } from './ui/button';

const OfflineIndicator = () => {
	const onRetry = () => window?.location.reload();
	return (
		<div className='w-full h-full flex flex-col gap-3 items-center justify-center bg-black p-3'>
			<p className='text-white font-medium flex gap-2 items-center animate-pulse text-center'>
				You're offline. Check your internet connection and try again.
			</p>
			<Button
				onClick={onRetry}
				variant='outline'
				className='bg-dark-grey w-max mx-auto text-white'
			>
				Retry
			</Button>
		</div>
	);
};

export default OfflineIndicator;
