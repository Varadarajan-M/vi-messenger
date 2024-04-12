import { PaperPlaneIcon } from '@radix-ui/react-icons';

const ChatEmptyPane = () => {
	return (
		<div className='w-full h-full flex flex-1 items-center justify-center bg-black'>
			<p className='text-white font-medium flex gap-2 items-center animate-pulse'>
				Click on a chat to start messaging
				<PaperPlaneIcon />
			</p>
		</div>
	);
};

export default ChatEmptyPane;
