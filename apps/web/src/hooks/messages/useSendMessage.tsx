import { sendMessage } from '@/api/message';
import { useSocket } from '@/contexts/SocketContext';
import { Message } from '@/types/message';
import { useChatsStore, useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';
import useAuthInfo from '../auth/useAuthInfo';

const useSendMessage = () => {
	const { user } = useAuthInfo();
	const socket = useSocket();

	const addMessage = useMessageStore((state) => state.addMessage);
	const findByIdAndUpdate = useMessageStore((state) => state.findByIdAndUpdate);
	const findByIdAndRemove = useMessageStore((state) => state.findByIdAndRemove);

	const findByIdAndUpdateChat = useChatsStore((state) => state.findByIdAndUpdate);

	const onSendMessage = useCallback(
		async (
			chatId: string,
			type: string,
			content: Message['content'],
			replyTo: Message | null = null,
			cb?: (message?: Message) => void,
		) => {
			if (typeof content === 'string') {
				content = content?.trim();
			}

			const newMsgId = Math.random().toString();

			const msg = {
				type,
				content,
			};

			const newMsg = {
				_id: newMsgId,
				chatId,
				sender: {
					_id: user?._id ?? '',
					username: user?.username ?? '',
					email: user?.email ?? '',
					createdAt: new Date().toString(),
					updatedAt: new Date().toString(),
				},
				seenBy: [user?._id ?? ''],
				type: msg.type as any,
				content: msg.content,
				createdAt: new Date().toString(),
				updatedAt: new Date().toString(),
				replyTo: replyTo || null,
			};

			addMessage(newMsg);

			cb?.(newMsg);

			const res = (await sendMessage(chatId, msg.type, msg.content, replyTo)) as {
				message: Message;
			};

			if (res?.message) {
				findByIdAndUpdate(newMsgId, res.message);

				// TODO remove this step for ai chat
				findByIdAndUpdateChat(chatId, { lastMessage: res.message });

				socket?.emit('new_message', {
					roomId: chatId,
					message: res.message,
				});
			} else {
				findByIdAndRemove(newMsgId);
			}
		},
		[
			addMessage,
			findByIdAndRemove,
			findByIdAndUpdate,
			findByIdAndUpdateChat,
			socket,
			user?._id,
			user?.email,
			user?.username,
		],
	);

	return { onSendMessage };
};

export default useSendMessage;
