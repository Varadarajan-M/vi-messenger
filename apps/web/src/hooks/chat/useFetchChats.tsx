import { useChatsStore } from '@/zustand/store';
import { useEffect } from 'react';

const useFetchChats = () => {
	const chats = useChatsStore((state) => state.chats);
	const fetchChats = useChatsStore((state) => state.fetchChats);

	useEffect(() => {
		fetchChats();
	}, [fetchChats]);

	return chats;
};

export default useFetchChats;
