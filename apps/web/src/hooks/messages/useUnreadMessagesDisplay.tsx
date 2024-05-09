import { useSocket } from '@/contexts/SocketContext';
import { useMessageStore } from '@/zustand/store';
import { useEffect, useRef } from 'react';

const useUnreadMessagesDisplay = (chatId: string) => {
	const unReadMessages = useMessageStore((state) => state.unReadMessages)?.[chatId as string];
	const setChatUnReadMessageList = useMessageStore((state) => state.setChatUnReadMessageList);
	const socket = useSocket();
	const messages = useMessageStore((state) => state.messages);
	const msgDisplayRef = useRef<HTMLParagraphElement | null>(null);

	const scrollToUnreadMsg = () => {
		msgDisplayRef?.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	useEffect(() => {
		let popupTimer: any, msgClearTimer: any;
		if (unReadMessages?.length > 0 && messages?.length > 0) {
			socket?.emit('message_seen', unReadMessages);
			popupTimer = setTimeout(scrollToUnreadMsg, 1000);
			msgClearTimer = setTimeout(() => {
				setChatUnReadMessageList(chatId, []);
			}, 8000);
		}
		return () => {
			clearTimeout(popupTimer);
			clearTimeout(msgClearTimer);
		};
	}, [chatId, setChatUnReadMessageList, socket, unReadMessages, messages]);

	useEffect(() => {
		return () => {
			setChatUnReadMessageList(chatId, []);
		};
	}, [chatId, setChatUnReadMessageList]);

	return { msgDisplayRef, unReadMessages };
};

export default useUnreadMessagesDisplay;
