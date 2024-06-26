import { useSocket } from '@/contexts/SocketContext';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useTypingStatus from '@/hooks/chat/useTypingStatus';
import { useOnlineUsers } from '@/zustand/store';
import { useEffect } from 'react';
import {
	useAddMessage,
	useChatUpdate,
	useDeleteMessage,
	useEditMessage,
	useJoinOnline,
	useReactToMessage,
	useSeenMessage,
} from './chat-container.hooks';
import ChatListingPane from './chat-listing-pane/chat-listing-pane';
import ChatMessagePane from './chat-message-pane/chat-message-pane';

const ChatsContainer = () => {
	const socket = useSocket();
	const onConnect = useJoinOnline();
	const onChatUpdate = useChatUpdate();
	const { chat: activeChat } = useActiveChat();
	const onAddMessage = useAddMessage();
	const onSeenMessage = useSeenMessage();
	const setOnlineUsers = useOnlineUsers((state) => state.setOnlineUsers);
	const { onUpdateTypingStatus } = useTypingStatus();
	const onDeleteMessage = useDeleteMessage();
	const onEditMessage = useEditMessage();
	const onReactMessage = useReactToMessage();

	useEffect(() => {
		if (socket) {
			socket?.on('connected', onConnect);
			socket?.on('chat_update', onChatUpdate);
			socket?.on('update_online_users', setOnlineUsers);
		}

		return () => {
			socket?.off('connected', onConnect);
			socket?.off('chat_update', onChatUpdate);
			socket?.off('update_online_users', setOnlineUsers);
		};
	}, [onChatUpdate, onConnect, setOnlineUsers, socket]);

	useEffect(() => {
		if (!activeChat?.length || !socket) return;

		socket?.emit('join_chat', activeChat);
		socket?.on('chat_message', onAddMessage);
		socket?.on('message_seen_ack', onSeenMessage);
		socket?.on('update_typing_status', onUpdateTypingStatus);
		socket?.on('message_deleted', onDeleteMessage);
		socket?.on('message_edited', onEditMessage);
		socket?.on('message_reaction_ack', onReactMessage);

		return () => {
			socket?.emit('leave_chat', activeChat);
			socket?.off('chat_message', onAddMessage);
			socket?.off('message_seen_ack', onSeenMessage);
			socket?.off('update_typing_status', onUpdateTypingStatus);
			socket?.off('message_deleted', onDeleteMessage);
			socket?.off('message_edited', onEditMessage);
			socket?.off('message_reaction_ack', onReactMessage);
		};
	}, [
		activeChat,
		onAddMessage,
		onDeleteMessage,
		onEditMessage,
		onReactMessage,
		onSeenMessage,
		onUpdateTypingStatus,
		socket,
	]);

	return (
		<main className='flex items-stretch h-full flex-1 bg-gradient-dark border-l-0 border-l-gray-300 rounded-l-3xl'>
			<ChatListingPane />
			<ChatMessagePane />
		</main>
	);
};

export default ChatsContainer;
