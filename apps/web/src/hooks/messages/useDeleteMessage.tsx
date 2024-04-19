import { deleteMessage } from '@/api/message';
import { useSocket } from '@/contexts/SocketContext';
import { useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';

const useDeleteMessage = () => {
	const socket = useSocket();

	const findByIdAndRemove = useMessageStore((state) => state.findByIdAndRemove);

	const onDeleteMessage = useCallback(
		async (messageId: string, chatId: string) => {
			findByIdAndRemove(messageId);

			const res = (await deleteMessage(messageId, chatId)) as any;

			if (res?.message) {
				socket?.emit('delete_message', {
					roomId: chatId,
					messageId: messageId,
				});
			} else {
				alert(res?.error ?? 'Failed to delete message');
			}
		},
		[findByIdAndRemove, socket],
	);

	return onDeleteMessage;
};

export default useDeleteMessage;
