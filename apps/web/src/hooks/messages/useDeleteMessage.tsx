import { deleteMessage } from '@/api/message';
import { toast } from '@/components/ui/use-toast';
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
				toast({
					description: 'Message Deleted',
					className: 'bg-black text-white',
				});
				socket?.emit('delete_message', {
					roomId: chatId,
					messageId: messageId,
				});
			} else {
				toast({
					title: 'Deletion Failed',
					description: res.error,
					duration: 2000,
					variant: 'destructive',
				});
			}
		},
		[findByIdAndRemove, socket],
	);

	return onDeleteMessage;
};

export default useDeleteMessage;
