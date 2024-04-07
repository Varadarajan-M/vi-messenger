import { getChatDetails } from '@/api/chat';
import { Chat } from '@/types/chat';
import { useEffect, useState } from 'react';

const useFetchSingleChat = (chatId: string) => {
	const [loading, setLoading] = useState(false);
	const [chat, setChat] = useState<Chat | null>(null);

	useEffect(() => {
		const fetchChat = async () => {
			if (chatId) {
				try {
					setLoading(true);
					const res = (await getChatDetails(chatId)) as any;
					if (res?.chat) setChat(res.chat);
				} catch (err) {
					console.log(err);
				} finally {
					setLoading(false);
				}
			}
		};
		fetchChat();
	}, [chatId]);

	return { loading, chat };
};

export default useFetchSingleChat;
