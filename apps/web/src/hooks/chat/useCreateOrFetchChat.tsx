import { createOrFetchPrivateChat } from '@/api/chat';
import { useChatsStore } from '@/zustand/store';
import { useCallback } from 'react';

import useSetAndPopulateActiveChat from './useSetAndPopulateActiveChat';

const useCreateOrFetchChat = () => {
	const loading = useChatsStore((state) => state.loading);
	const setLoading = useChatsStore((state) => state.setLoading);
	const setOrCreateActiveChat = useSetAndPopulateActiveChat();

	const createOrFetchDm = useCallback(
		async (userId: string) => {
			try {
				setLoading(true);
				const res: any = await createOrFetchPrivateChat(userId);
				if (res?.chat) {
					setOrCreateActiveChat(res?.chat);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[setLoading, setOrCreateActiveChat],
	);

	return { createOrFetchDm, loading };
};

export default useCreateOrFetchChat;
