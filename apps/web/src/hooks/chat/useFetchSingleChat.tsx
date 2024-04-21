import { getChatDetails } from '@/api/chat';
import { Chat } from '@/types/chat';
import { useEffect, useState } from 'react';
import useActiveChat from './useActiveChat';

const useFetchSingleChat = (chatId: string) => {
	const [loading, setLoading] = useState(false);
	const [chat, setChat] = useState<Chat | null>(null);
	const { resetChat } = useActiveChat();

	useEffect(() => {
		const fetchChat = async () => {
			if (chatId) {
				try {
					setLoading(true);
					const res = (await getChatDetails(chatId)) as any;
					if (res?.chat) setChat(res.chat);
					else resetChat();
				} catch (err) {
					console.log(err);
				} finally {
					setLoading(false);
				}
			}
		};
		fetchChat();
	}, [chatId, resetChat]);

	return { loading, chat };
};

export default useFetchSingleChat;
