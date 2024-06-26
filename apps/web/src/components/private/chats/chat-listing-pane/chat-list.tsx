import { useEffect } from 'react';

import Loader from '@/components/ui/loader';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchChatsAndUnReadMsgs from '@/hooks/chat/useFetchChatsAndUnReadMsgs';
import useFilteredChats from '@/hooks/chat/useFilteredChats';
import { scrollToChat } from '@/lib/chat';
import ChatPreview from './chat-preview';

const ChatList = () => {
	const { chat: chatId } = useActiveChat();
	const { chats, chatLoading, unReadMessages } = useFetchChatsAndUnReadMsgs();

	const filteredChats = useFilteredChats(chats);

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
			{filteredChats?.length === 0 && !chatLoading && (
				<div className='text-center text-white px-4 py-8 my-auto'>
					<span className='text-xl font-bold'>No chats found!</span>
					<br />
					<span className='text-center text-gray-400 font-medium -mt-1'>
						The search bar is your friend - use it to find interesting people and start
						chatting.
					</span>
				</div>
			)}
			{!chatLoading &&
				filteredChats?.map((chat) => (
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
