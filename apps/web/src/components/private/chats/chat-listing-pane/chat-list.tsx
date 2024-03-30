import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import ChatPreview from './chat-preview';

import { DUMMY_CHATS } from '../data';

const ChatList = () => {
	const [searchParams] = useSearchParams();

	const activeChat = searchParams.get('chat') ?? '';

	useEffect(() => {
		if (activeChat?.trim().length) {
			const chatPreviewEl = document.getElementById(activeChat);
			chatPreviewEl?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [activeChat]);

	return (
		<div className='flex flex-col gap-3 overflow-auto scroll-smooth'>
			{DUMMY_CHATS.map((chat) => (
				<ChatPreview
					key={chat._id}
					chat={chat}
					isActive={activeChat === chat._id?.toString()}
				/>
			))}
		</div>
	);
};

export default ChatList;
