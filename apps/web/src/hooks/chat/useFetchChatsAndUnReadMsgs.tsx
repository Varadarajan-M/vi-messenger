import { useChatsStore, useMessageStore } from '@/zustand/store';
import { useEffect } from 'react';

const useFetchChatsAndUnReadMsgs = () => {
	const chats = useChatsStore((state) => state.chats);
	const fetchChats = useChatsStore((state) => state.fetchChats);
	const unReadMessages = useMessageStore((state) => state.unReadMessages);

	useEffect(() => {
		fetchChats();
	}, [fetchChats]);

	return { chats, unReadMessages };
};

export default useFetchChatsAndUnReadMsgs;
