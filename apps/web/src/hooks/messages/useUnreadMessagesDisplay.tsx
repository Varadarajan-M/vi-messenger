import { useSocket } from '@/contexts/SocketContext';
import { useMessageStore } from '@/zustand/store';
import { useEffect, useRef } from 'react';

const useUnreadMessagesDisplay = (chatId: string) => {
	const unReadMessages = useMessageStore((state) => state.unReadMessages)?.[chatId as string];
	const setChatUnReadMessageList = useMessageStore((state) => state.setChatUnReadMessageList);
	const socket = useSocket();

	const msgDisplayRef = useRef<HTMLParagraphElement | null>(null);

	const scrollToUnreadMsg = () => {
		msgDisplayRef?.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
	};

	useEffect(() => {
		if (unReadMessages?.length > 0) {
			console.log('emitted message_seen', unReadMessages);
			socket?.emit('message_seen', unReadMessages);
			const popupTimer = setTimeout(scrollToUnreadMsg, 300);
			const msgClearTimer = setTimeout(() => {
				setChatUnReadMessageList(chatId, []);
			}, 8000);

			return () => {
				clearTimeout(popupTimer);
				clearTimeout(msgClearTimer);
				setChatUnReadMessageList(chatId, []);
			};
		}
	}, [chatId, setChatUnReadMessageList, socket, unReadMessages]);

	return { msgDisplayRef, unReadMessages };
};

export default useUnreadMessagesDisplay;
