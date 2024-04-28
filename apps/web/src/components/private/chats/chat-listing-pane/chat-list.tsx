import { useEffect } from 'react';

import Loader from '@/components/ui/loader';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchChatsAndUnReadMsgs from '@/hooks/chat/useFetchChatsAndUnReadMsgs';
import { scrollToChat } from '@/lib/chat';
import ChatPreview from './chat-preview';

const ChatList = () => {
	const { chat: chatId } = useActiveChat();
	const { chats, chatLoading, unReadMessages } = useFetchChatsAndUnReadMsgs();

	useEffect(() => {
		scrollToChat(chatId);
	}, [chatId]);

	return (
		<div className='flex flex-col gap-3 overflow-auto scroll-smooth h-full'>
			{chatLoading && (
				<div className='flex h-full w-full items-center justify-center'>
					<Loader size='40px' />
				</div>
			)}
			{chats?.length === 0 && !chatLoading && (
				<p className='text-gray-400 text-center my-auto'>No Chats</p>
			)}
			{!chatLoading &&
				chats?.map((chat) => (
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
