import OfflineIndicator from '@/components/OfflineIndicator';
import useOnlineStatus from '@/hooks/common/useOnlineStatus';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

const ChatEmptyPane = () => {
	const isOnline = useOnlineStatus();

	return (
		<div className='w-full h-full flex flex-1 items-center justify-center bg-black'>
			{isOnline ? (
				<p className='text-white font-medium flex gap-2 items-center animate-pulse'>
					Click on a chat to start messaging
					<PaperPlaneIcon />
				</p>
			) : (
				<OfflineIndicator />
			)}
		</div>
	);
};

export default ChatEmptyPane;
