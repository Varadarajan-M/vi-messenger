import { useSearchParams } from 'react-router-dom';

import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import { Message } from '@/types/message';
import { useMessageStore } from '@/zustand/store';
import { useCallback, useEffect } from 'react';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const socket = useSocket();
	const [searchParams] = useSearchParams();
	const chat = searchParams.get('chat') ?? '';
	const { user } = useAuthInfo();
	const addMessage = useMessageStore((state) => state.addMessage);

	const onAddMessage = useCallback(
		(message: Message) => {
			addMessage({ ...message, seenBy: [...message.seenBy, user?._id as string] });
		},
		[addMessage, user],
	);

	useEffect(() => {
		if (!chat?.length || !socket) return;

		socket?.emit('join_chat', chat);
		socket?.on('chat_message', onAddMessage);

		return () => {
			socket?.emit('leave_chat', chat);
			socket?.off('chat_message', onAddMessage);
		};
	}, [socket, chat, onAddMessage]);

	return (
		<section className='h-full pt-5 px-7 flex-1 bg-black flex flex-col'>
			<ChatHeader chatId={chat} />
			<ChatMessageContainer chatId={chat} />
		</section>
	);
};

export default ChatMessagePane;
