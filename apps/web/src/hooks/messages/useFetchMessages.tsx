import { useMessageStore } from '@/zustand/store';
import { useEffect } from 'react';
import useActiveChat from '../chat/useActiveChat';

const useFetchMessages = (chatId: string, skip?: number, limit?: number) => {
	const messages = useMessageStore((state) => state.messages);
	const fetchMessages = useMessageStore((state) => state.fetchMessages);
	const loading = useMessageStore((state) => state.loading);
	const { chat: activeChatId } = useActiveChat();

	useEffect(() => {
		if (!chatId || chatId !== activeChatId) return;
		fetchMessages(chatId, skip, limit);
	}, [activeChatId, chatId, fetchMessages, limit, skip]);

	return { loading, messages };
};

export default useFetchMessages;
