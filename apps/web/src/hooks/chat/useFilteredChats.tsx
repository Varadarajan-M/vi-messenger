import { Chat } from '@/types/chat';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const useFilteredChats = (chats: Partial<Chat>[]) => {
	const window = useSearchParams()[0].get('window') ?? 'all-chats';

	const filteredChats = useMemo(() => {
		if (window === 'ai-chat') return chats;

		return window === 'all-chats'
			? chats
			: chats.filter((chat) => (window === 'groups' ? chat?.admin : !chat.admin));
	}, [chats, window]);

	return filteredChats;
};

export default useFilteredChats;
