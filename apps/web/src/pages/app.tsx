import ChatsContainer from '@/components/private/chats/chat-container';
import ChatSidebar from '@/components/private/chats/chat-sidebar/chat-sidebar';
import { useSocket } from '@/contexts/SocketContext';
import { Message } from '@/types/message';
import { useChatsStore } from '@/zustand/store';
import { useCallback, useEffect } from 'react';

const AppPage = () => {
	const socket = useSocket();
	const findByIdAndUpdateChat = useChatsStore((state) => state.findByIdAndUpdate);

	const onConnect = useCallback(() => {
		console.log('Socket connected');
		socket?.emit('join_online');
	}, [socket]);

	const onChatUpdate = useCallback(
		(message: Message) => {
			console.log('chat_upadte received', message);
			findByIdAndUpdateChat(message?.chatId, { lastMessage: message });
		},
		[findByIdAndUpdateChat],
	);

	useEffect(() => {
		// On Connect Server emitted a Connected event to acknowledge the connection
		if (socket) {
			socket?.on('connected', onConnect);
			socket?.on('chat_update', onChatUpdate);
		}

		return () => {
			socket?.off('connected', onConnect);
			socket?.off('chat_update', onChatUpdate);
		};
	}, [onChatUpdate, onConnect, socket]);

	return (
		<section className='chats-home bg-black h-screen w-full overflow-hidden flex'>
			<ChatSidebar />
			<ChatsContainer />
		</section>
	);
};

export default AppPage;
