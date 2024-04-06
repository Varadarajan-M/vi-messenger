import { getMessageSenderText, getPrivateChatName } from '@/lib/chat';
import { getTimeFromNow } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import ChatAvatar from './chat-avatar';

type ChatPreviewProps = {
	chat: {
		name: string;
		members: string[];
		lastMessage: any;
		_id: string | number;
		avatar: string;
		time?: string;
		admin?: string;
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

	const getChatSenderPrefix = () => {
		if (chat?.admin) return `${getMessageSenderText(chat.lastMessage?.sender)}:`;
		return getMessageSenderText(chat.lastMessage?.sender) === 'You' ? 'You:' : '';
	};

	return (
		<div
			id={chat._id?.toString()}
			className={cn(
				'flex p-3 gap-3 rounded-xl bg-black hover:bg-gray-900 mr-3 cursor-pointer focus-visible:bg-dark-grey focus-visible:bg-opacity-50 focus-visible:outline-none',
				{
					'bg-dark-grey': isActive,
				},
			)}
			onClick={handleChatClick}
			onKeyDown={handleKeyDown}
			role='button'
			tabIndex={0}
			aria-label={`Chat with ${chat.name}`}
			aria-describedby={`lastMessage-${chat._id}`}
		>
			<ChatAvatar
				img={chat.avatar ?? 'https://i.pravatar.cc/300'}
				variant='block'
				size='md'
			/>
			<div className='flex justify-between gap-3 flex-1 '>
				<div className='w-20'>
					<h3 className='text-white font-medium ellipsis-1'>
						{!chat?.admin ? getPrivateChatName(chat.members as any) : chat.name}
					</h3>
					{chat.lastMessage && (
						<p className='ellipsis-1 text-gray-500' title={chat.lastMessage?.content}>
							{getChatSenderPrefix()}
							{chat.lastMessage?.content}
						</p>
					)}
				</div>
				<span className='text-gray-400 text-xs tracking-tighter justify-end self-center -ml-6'>
					<time className='ellipsis-1'>
						{getTimeFromNow(chat.lastMessage?.createdAt)}
					</time>
				</span>
			</div>
		</div>
	);
};

export default ChatPreview;
