import { useSocket } from '@/contexts/SocketContext';
import { MessageReaction } from '@/types/message';
import { useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';
import useAuthInfo from '../auth/useAuthInfo';

const useReactToMessage = () => {
	const toggleReactionOnMessage = useMessageStore((state) => state.toggleReactionOnMessage);
	const getMessage = useMessageStore((state) => state.getMessage);
	const { user } = useAuthInfo();
	const socket = useSocket();
	const onReactToMessage = useCallback(
		async (messageId: string, reaction: MessageReaction) => {
			toggleReactionOnMessage(messageId, user?._id as string, reaction);
			const message = getMessage(messageId);
			socket?.emit('message_reaction', {
				roomId: message?.chatId,
				messageId,
				reactions: message?.reactions,
			});
		},
		[getMessage, socket, toggleReactionOnMessage, user?._id],
	);
	return onReactToMessage;
};

export default useReactToMessage;
