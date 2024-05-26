import { Chat } from '@/types/chat';
import { useChatsStore } from '@/zustand/store';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSetAndPopulateActiveChat = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const addToChats = useChatsStore((state) => state.addToChats);

	const chats = useChatsStore((state) => state.chats);

	const setOrCreateActiveChat = useCallback(
		(activeChat: Chat) => {
			const chat = chats.find((chat) => chat?._id === activeChat?._id);
			if (!chat) {
				addToChats(activeChat);
			}
			searchParams.set('chat', activeChat?._id?.toString());
			const activeWindow = searchParams.get('window');
			searchParams.set('window', activeWindow === 'ai-chat' ? 'all-chats' : activeWindow);
			setSearchParams(searchParams.toString());
		},
		[addToChats, chats, searchParams, setSearchParams],
	);

	return setOrCreateActiveChat;
};

export default useSetAndPopulateActiveChat;
