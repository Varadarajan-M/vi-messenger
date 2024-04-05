import { useMessageStore } from '@/zustand/store';
import { useEffect } from 'react';

const useFetchMessages = (chatId: string) => {
	const messages = useMessageStore((state) => state.messages);
	const fetchMessages = useMessageStore((state) => state.fetchMessages);

	useEffect(() => {
		if (!chatId) return;
		fetchMessages(chatId);
	}, [chatId, fetchMessages]);

	return messages;
};

export default useFetchMessages;
