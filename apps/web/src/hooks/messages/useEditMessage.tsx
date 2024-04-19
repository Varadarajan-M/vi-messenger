import { editMessage } from '@/api/message';
import { useSocket } from '@/contexts/SocketContext';
import { useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';

const useEditMessage = () => {
	const socket = useSocket();

	const findByIdAndUpdate = useMessageStore((state) => state.findByIdAndUpdate);

	const onEditMessage = useCallback(
		async (messageId: string, chatId: string, message: string) => {
			const res = (await editMessage(messageId, chatId, message)) as any;
			findByIdAndUpdate(messageId, { type: 'text', content: message });

			if (res?.message) {
				socket?.emit('edit_message', {
					roomId: chatId,
					message: res.message,
				});
			} else {
				alert(res?.error ?? 'Failed to edit message');
			}
		},
		[findByIdAndUpdate, socket],
	);

	return onEditMessage;
};

export default useEditMessage;
