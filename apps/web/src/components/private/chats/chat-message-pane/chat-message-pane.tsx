import { useSearchParams } from 'react-router-dom';

import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useFetchSingleChat from '@/hooks/chat/useFetchSingleChat';
import { Message } from '@/types/message';
import { useMessageStore } from '@/zustand/store';
import { useCallback, useEffect } from 'react';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const { user } = useAuthInfo();
	const socket = useSocket();
	const [searchParams] = useSearchParams();

	const chat = searchParams.get('chat') ?? '';

	const { chat: chatDetails, loading: chatLoading } = useFetchSingleChat(chat);

	const addMessage = useMessageStore((state) => state.addMessage);
	const findByIdAndUpdateMsg = useMessageStore((state) => state.findByIdAndUpdate);

	const onAddMessage = useCallback(
		(message: Message) => {
			addMessage({ ...message, seenBy: [...message.seenBy, user?._id as string] });
			socket?.emit('message_seen', [message._id]);
		},
		[addMessage, socket, user?._id],
	);

	const onSeenMessage = useCallback(
		(message: Message) => {
			console.log('received message_seen_ack... updating message:', message);
			findByIdAndUpdateMsg(message._id, { seenBy: message.seenBy });
		},
		[findByIdAndUpdateMsg],
	);

	useEffect(() => {
		if (!chat?.length || !socket) return;

		socket?.emit('join_chat', chat);
		socket?.on('chat_message', onAddMessage);
		socket?.on('message_seen_ack', onSeenMessage);

		return () => {
			socket?.emit('leave_chat', chat);
			socket?.off('chat_message', onAddMessage);
			socket?.off('message_seen_ack', onSeenMessage);
		};
	}, [socket, chat, onAddMessage, onSeenMessage]);

	return (
		<section className='h-full pt-5 px-7 flex-1 bg-black flex flex-col'>
			<ChatHeader chat={chatDetails!} loading={chatLoading} />
			<ChatMessageContainer chat={chatDetails!} />
		</section>
	);
};

export default ChatMessagePane;
