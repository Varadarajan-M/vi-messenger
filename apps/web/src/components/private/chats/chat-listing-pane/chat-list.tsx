import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import ChatPreview from './chat-preview';

import useFetchChatsAndUnReadMsgs from '@/hooks/chat/useFetchChatsAndUnReadMsgs';

const ChatList = () => {
	const [searchParams] = useSearchParams();
	const activeChat = searchParams.get('chat') ?? '';

	const { chats, unReadMessages } = useFetchChatsAndUnReadMsgs();

	useEffect(() => {
		if (activeChat?.trim().length) {
			const chatPreviewEl = document.getElementById(activeChat);
			chatPreviewEl?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [activeChat]);

	return (
		<div className='flex flex-col gap-3 overflow-auto scroll-smooth'>
			{chats?.map((chat) => (
				<ChatPreview
					key={chat?._id}
					chat={chat as any}
					isActive={activeChat === chat?._id?.toString()}
					unReadMessages={unReadMessages[chat?._id?.toString() as string] ?? []}
				/>
			))}
		</div>
	);
};

export default ChatList;
