import { getMessageReactions } from '@/api/message';
import { User } from '@/types/auth';
import { Message, MessageReaction } from '@/types/message';
import { useCallback, useState } from 'react';

const useFetchReactions = () => {
	const [reactions, setReactions] = useState<Record<MessageReaction, User[]>>({} as any);
	const [loading, setLoading] = useState(false);

	const fetchReactions = useCallback(async (shouldFetch: boolean, message: Message) => {
		if (shouldFetch) {
			try {
				setLoading(true);
				const res = (await getMessageReactions(message?.chatId, message?._id)) as {
					reactions: Record<MessageReaction, User[]>;
				};
				if (res?.reactions) {
					setReactions(res?.reactions);
				}
			} finally {
				setLoading(false);
			}
		}
	}, []);
	return {
		fetchReactions,
		loading,
		reactions,
	};
};

export default useFetchReactions;
