import { useMessageStore } from '@/zustand/store';
import { useEffect } from 'react';
import useActiveChat from '../chat/useActiveChat';

const useFetchMessages = (chatId: string, skip?: number, limit?: number) => {
	const messages = useMessageStore((state) => state.messages);
	const fetchMessages = useMessageStore((state) => state.fetchMessages);
	const setMessages = useMessageStore((state) => state.setMessages);
	const loading = useMessageStore((state) => state.loading);
	const totalCount = useMessageStore((state) => state.totalMessages);
	const { chat: activeChatId } = useActiveChat();

	useEffect(() => {
		if (!chatId || chatId !== activeChatId) return;
		fetchMessages(chatId, skip, limit);
	}, [activeChatId, chatId, fetchMessages, limit, skip]);

	useEffect(() => {
		return () => {
			setMessages([]);
		};
	}, [setMessages]);

	return { loading, messages, totalCount };
};

export default useFetchMessages;
