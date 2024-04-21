import { useMessageStore } from '@/zustand/store';
import { useEffect } from 'react';

const useFetchMessages = (chatId: string, skip?: number, limit?: number) => {
	const messages = useMessageStore((state) => state.messages);
	const fetchMessages = useMessageStore((state) => state.fetchMessages);
	const loading = useMessageStore((state) => state.loading);

	useEffect(() => {
		if (!chatId) return;
		fetchMessages(chatId, skip, limit);
	}, [chatId, fetchMessages, limit, skip]);

	return { loading, messages };
};

export default useFetchMessages;
