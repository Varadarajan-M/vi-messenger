import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useActiveChat from '@/hooks/chat/useActiveChat';
import { Message } from '@/types/message';
import { useChatsStore, useMessageStore } from '@/zustand/store';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const inChatNotification =
	'https://res.cloudinary.com/dsyrltebn/video/upload/v1714323570/dkbexwp7498pl4avxkpy.mp3';

const windowNotification =
	'https://res.cloudinary.com/dsyrltebn/video/upload/v1714323571/ay2yeiivobanuqbnfkzg.wav';

let audioElement: HTMLAudioElement;

export const useChatUpdate = () => {
	const findByIdAndUpdateChat = useChatsStore((state) => state.findByIdAndUpdate);
	const addToUnreadMessageList = useMessageStore((state) => state.addToUnReadMessageList);
	const chats = useChatsStore((state) => state.chats);
	const [params, setParams] = useSearchParams();
	const { chat } = useActiveChat();

	useEffect(() => {
		audioElement = new Audio();
	}, []);

	const checkAndUpdateChatFilter = useCallback(
		(chatId: string) => {
			const activeWindow = params.get('window') ?? 'all-chats';
			const currentChatType = chats?.find((c) => c?._id === chatId)?.admin ? 'groups' : 'dms';
			if (activeWindow !== currentChatType && activeWindow !== 'all-chats') {
				params.set('window', 'all-chats');
				setParams(params?.toString());
			}
		},
		[chats, params, setParams],
	);

	const onChatUpdate = useCallback(
		(message: Message) => {
			findByIdAndUpdateChat(message?.chatId, { lastMessage: message });
			checkAndUpdateChatFilter(message?.chatId);
			if (chat !== message?.chatId) {
				audioElement.src = windowNotification;
				audioElement.play();
				addToUnreadMessageList(message?.chatId, message?._id);
			}
		},
		[addToUnreadMessageList, chat, checkAndUpdateChatFilter, findByIdAndUpdateChat],
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

	useEffect(() => {
		audioElement = new Audio();
	}, []);

	const onAddMessage = useCallback(
		(message: Message) => {
			addMessage({ ...message, seenBy: [...message.seenBy, user?._id as string] });
			audioElement.src = inChatNotification;
			audioElement.play();
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

export const useReactToMessage = () => {
	const findByIdAndUpdateMsg = useMessageStore((state) => state.findByIdAndUpdate);

	const onReactToMessage = useCallback(
		(message: Message) => {
			findByIdAndUpdateMsg(message._id, { reactions: message?.reactions });
		},
		[findByIdAndUpdateMsg],
	);

	return onReactToMessage;
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
