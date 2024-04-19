import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useActiveChat from '@/hooks/chat/useActiveChat';
import { Message } from '@/types/message';
import { useChatsStore, useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';

export const useChatUpdate = () => {
	const findByIdAndUpdateChat = useChatsStore((state) => state.findByIdAndUpdate);
	const addToUnreadMessageList = useMessageStore((state) => state.addToUnReadMessageList);

	const { chat } = useActiveChat();

	const onChatUpdate = useCallback(
		(message: Message) => {
			findByIdAndUpdateChat(message?.chatId, { lastMessage: message });

			if (chat !== message?.chatId) {
				addToUnreadMessageList(message?.chatId, message?._id);
			}
		},
		[addToUnreadMessageList, chat, findByIdAndUpdateChat],
	);

	return onChatUpdate;
};

export const useJoinOnline = () => {
	const socket = useSocket();
	const onJoinOnline = useCallback(() => {
		socket?.emit('join_online');
	}, [socket]);
	return onJoinOnline;
};

export const useAddMessage = () => {
	const addMessage = useMessageStore((state) => state.addMessage);
	const { user } = useAuthInfo();
	const socket = useSocket();

	const onAddMessage = useCallback(
		(message: Message) => {
			addMessage({ ...message, seenBy: [...message.seenBy, user?._id as string] });
			socket?.emit('message_seen', [message._id]);
		},
		[addMessage, socket, user?._id],
	);

	return onAddMessage;
};

export const useDeleteMessage = () => {
	const findByIdAndRemove = useMessageStore((state) => state.findByIdAndRemove);

	const onDeleteMessage = useCallback(
		(messageId: string) => {
			findByIdAndRemove(messageId);
		},
		[findByIdAndRemove],
	);

	return onDeleteMessage;
};

export const useEditMessage = () => {
	const findByIdAndUpdateMsg = useMessageStore((state) => state.findByIdAndUpdate);

	const onEditMessage = useCallback(
		(message: Message) => {
			findByIdAndUpdateMsg(message._id, { content: message?.content });
		},
		[findByIdAndUpdateMsg],
	);

	return onEditMessage;
};

export const useSeenMessage = () => {
	const findByIdAndUpdateMsg = useMessageStore((state) => state.findByIdAndUpdate);

	const onSeenMessage = useCallback(
		(message: Message) => {
			findByIdAndUpdateMsg(message._id, { seenBy: message.seenBy });
		},
		[findByIdAndUpdateMsg],
	);

	return onSeenMessage;
};
