import useActiveChat from '@/hooks/chat/useActiveChat';
import { getChatSenderPrefix, getPrivateChatName, scrollToChat } from '@/lib/chat';
import { getTimeFromNow } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import ChatAvatar from './chat-avatar';

const ChatDetails = memo(
	({
		name,
		content,
		time,
		msgCount = 0,
	}: {
		name: string;
		content: string;
		time: string;
		msgCount: number;
	}) => {
		return (
			<div className='flex justify-between gap-3 flex-1 '>
				<div className='w-20'>
					<h3 className='text-white font-medium ellipsis-1'>{name}</h3>
					{content && (
						<p className='ellipsis-1 text-gray-500' title={content}>
							{content}
						</p>
					)}
				</div>
				<div className='flex flex-col gap-2 items-center justify-center h-full'>
					<span className='text-gray-400 text-xs tracking-tighter justify-end self-center -ml-6'>
						<time className='ellipsis-1'>{getTimeFromNow(time)}</time>
					</span>
					{msgCount > 0 && (
						<span className='bg-pink-500 px-2 py-0.5 rounded-full text-black font-bold text-xs tracking-tighter justify-end self-end ellipsis-1'>
							{msgCount}
						</span>
					)}
				</div>
			</div>
		);
	},
);

type ChatPreviewProps = {
	chat: {
		name: string;
		members: string[];
		lastMessage: any;
		_id: string | number;
		avatar: string;
		time?: string;
		admin: string;
	};
	isActive: boolean;
	unReadMessages?: string[];
};

const ChatPreview = ({ chat, isActive, unReadMessages }: ChatPreviewProps) => {
	const { setChat } = useActiveChat();
	const handleChatClick = () => {
		setChat(chat._id?.toString());
		scrollToChat(chat._id?.toString());
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleChatClick();
		}
	};

	const getMessagePreview = () => {
		const senderPrefix = getChatSenderPrefix(chat);
		const content = chat?.lastMessage?.content?.url
			? 'Attachment📎'
			: chat?.lastMessage?.content;

		return `${senderPrefix}${content}`;
	};
	return (
		<div
			id={chat._id?.toString()}
			className={cn(
				'flex p-3 gap-3 rounded-xl bg-black hover:bg-gray-900 mr-3 cursor-pointer focus-visible:bg-dark-grey focus-visible:bg-opacity-50 focus-visible:outline-none',
				{
					'bg-dark-grey': isActive,
					'animate-pulse': (unReadMessages?.length ?? 0) > 0,
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
			<ChatDetails
				name={`${!chat?.admin ? getPrivateChatName(chat.members as any) : chat.name}`}
				content={getMessagePreview()}
				time={chat?.lastMessage?.createdAt}
				msgCount={unReadMessages?.length ?? 0}
			/>
		</div>
	);
};

export default memo(ChatPreview);
