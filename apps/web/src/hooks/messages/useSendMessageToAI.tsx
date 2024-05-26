import { BASE_URL } from '@/lib/axios';
import { fetchStream } from '@/lib/utils';
import { Message } from '@/types/message';
import { useMessageStore } from '@/zustand/store';
import { useCallback } from 'react';
import useAuthInfo from '../auth/useAuthInfo';

const useSendMessage = () => {
	const { user } = useAuthInfo();

	const addMessage = useMessageStore((state) => state.addMessage);
	const findByIdAndUpdate = useMessageStore((state) => state.findByIdAndUpdate);
	const fetchMessages = useMessageStore((state) => state.fetchMessages);

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
						try {
							const res = data?.split('data: ')?.[1];

							if (!res) return;

							const json = JSON.parse(res!);
							if (!json?.ok) return onError?.(json?.error ?? 'Unknown error');

							if (json?.type === 'user_message') {
								userMsg = json?.data;
								findByIdAndUpdate(newMsgId, userMsg);
							}

							let partialChunk = '';

							if (json?.type === 'ai_message_chunk') {
								partialChunk += json?.data;

								const len = partialChunk?.length;

								streamingMsg += json?.data;
								if (len > 8) {
									onStream(streamingMsg);
									streamingMsg = '';
									partialChunk = '';
								}
							}

							if (json?.type === 'ai_message') {
								lastMsg = json?.data;
							}
						} catch (error) {

							fetchMessages(chatId, 0, 10);
							onStreamEnd();
						}
					},
					onEnd() {
						onStreamEnd();
						addMessage(lastMsg);
					},
				},
			);
		},
		[
			addMessage,
			fetchMessages,
			findByIdAndUpdate,
			user?._id,
			user?.email,
			user?.token,
			user?.username,
		],
	);

	return { onSendMessage };
};

export default useSendMessage;
