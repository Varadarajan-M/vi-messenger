import { BASE_URL } from '@/lib/axios';
import { fetchStream } from '@/lib/utils';
import { Message } from '@/types/message';
import { useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';
import useAuthInfo from '../auth/useAuthInfo';

const useSendMessage = () => {
	const { user } = useAuthInfo();
	// const socket = useSocket();

	const addMessage = useMessageStore((state) => state.addMessage);
	const findByIdAndUpdate = useMessageStore((state) => state.findByIdAndUpdate);
	// const findByIdAndRemove = useMessageStore((state) => state.findByIdAndRemove);

	// const findByIdAndUpdateChat = useChatsStore((state) => state.findByIdAndUpdate);

	const onSendMessage = useCallback(
		async (
			chatId: string,
			type: string,
			content: Message['content'],
			onStream: (data: string) => void,
			onError: (error: string) => void,
			onStreamEnd: () => void,
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
			};

			addMessage(newMsg);

			cb?.(newMsg);

			let lastMsg: any,
				userMsg: any,
				streamingMsg = '';

			await fetchStream(
				`${BASE_URL}/message/${chatId}/ai`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${user?.token}`,
					},
					body: JSON.stringify(msg),
				},
				{
					onMessage(data) {
						const res = data?.split('data: ')?.[1];
						const json = JSON.parse(res!);
						if (!json?.ok) return onError?.(json?.error ?? 'Unknown error');

						if (json?.type === 'user_message') {
							userMsg = json?.data;
							findByIdAndUpdate(newMsgId, userMsg);
						}

						if (json?.type === 'ai_message_chunk') {
							const len = json?.data?.length;
							streamingMsg += json?.data;
							if (len > 8) {
								onStream(streamingMsg);
								streamingMsg = '';
							}
						}

						if (json?.type === 'ai_message') {
							lastMsg = json?.data;
						}
					},
					onEnd() {
						onStreamEnd();
						addMessage(lastMsg);
					},
				},
			);
		},
		[addMessage, findByIdAndUpdate, user?._id, user?.email, user?.token, user?.username],
	);

	return { onSendMessage };
};

export default useSendMessage;
