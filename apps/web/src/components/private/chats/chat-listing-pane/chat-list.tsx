import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import ChatPreview from './chat-preview';

import useFetchChats from '@/hooks/chat/useFetchChats';

const ChatList = () => {
	const [searchParams] = useSearchParams();
	const activeChat = searchParams.get('chat') ?? '';

	const chats = useFetchChats();

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
					key={chat._id}
					chat={chat as any}
					isActive={activeChat === chat._id?.toString()}
				/>
			))}
		</div>
	);
};

export default ChatList;
