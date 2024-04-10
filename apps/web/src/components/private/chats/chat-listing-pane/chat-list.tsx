import { useEffect } from 'react';

import ChatPreview from './chat-preview';

import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchChatsAndUnReadMsgs from '@/hooks/chat/useFetchChatsAndUnReadMsgs';
import { scrollToChat } from '@/lib/chat';

const ChatList = () => {
	const { chat: chatId } = useActiveChat();
	const { chats, unReadMessages } = useFetchChatsAndUnReadMsgs();

	useEffect(() => {
		scrollToChat(chatId);
	}, [chatId]);

	return (
		<div className='flex flex-col gap-3 overflow-auto scroll-smooth'>
			{chats?.map((chat) => (
				<ChatPreview
					key={chat?._id}
					chat={chat as any}
					isActive={chatId === chat?._id?.toString()}
					unReadMessages={unReadMessages[chat?._id?.toString() as string] ?? []}
				/>
			))}
		</div>
	);
};

export default ChatList;
