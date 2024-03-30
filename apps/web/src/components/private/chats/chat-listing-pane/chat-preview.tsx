import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import ChatAvatar from './chat-avatar';

type ChatPreviewProps = {
	chat: {
		name: string;
		members: string[];
		lastMessage: string;
		_id: string | number;
		avatar: string;
		time: string;
	};
	isActive: boolean;
};

const ChatPreview = ({ chat, isActive }: ChatPreviewProps) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const handleChatClick = () => {
		searchParams.set('chat', chat._id?.toString());
		setSearchParams(searchParams.toString());
		const chatPreviewEl = document.getElementById(chat._id?.toString());
		chatPreviewEl?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleChatClick();
		}
	};

	return (
		<div
			id={chat._id?.toString()}
			className={cn(
				'flex p-3 gap-3 rounded-xl hover:bg-light-grey hover:bg-opacity-50 mr-3 cursor-pointer focus-visible:bg-light-grey focus-visible:bg-opacity-50 focus-visible:outline-none',
				{
					'bg-light-grey bg-opacity-50': isActive,
				},
			)}
			onClick={handleChatClick}
			onKeyDown={handleKeyDown}
			role='button'
			tabIndex={0}
			aria-label={`Chat with ${chat.name}`}
			aria-describedby={`lastMessage-${chat._id}`}
		>
			<ChatAvatar img={chat.avatar} variant='block' />
			<div className='flex justify-between gap-3 flex-1 '>
				<div>
					<h3 className='text-white font-medium ellipsis-1'>{chat.name}</h3>
					<p className='ellipsis-1 text-gray-500' title={chat.lastMessage}>
						{chat.lastMessage}
					</p>
				</div>
				<span className='text-gray-400 text-xs tracking-tighter justify-end -ml-6'>
					<time className='ellipsis-1'>{chat.time} am</time>
				</span>
			</div>
		</div>
	);
};

export default ChatPreview;
