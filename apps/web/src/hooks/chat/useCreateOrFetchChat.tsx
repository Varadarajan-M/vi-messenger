import { createOrFetchPrivateChat } from '@/api/chat';
import { useChatsStore } from '@/zustand/store';
import { useCallback } from 'react';

import useSetAndPopulateActiveChat from './useSetAndPopulateActiveChat';
import useActiveWindow from './useActiveWindow';

const useCreateOrFetchChat = () => {
	const loading = useChatsStore((state) => state.loading);
	const setLoading = useChatsStore((state) => state.setLoading);
	const setOrCreateActiveChat = useSetAndPopulateActiveChat();
	const { activeWindow, setActiveWindow } = useActiveWindow();

	const createOrFetchDm = useCallback(
		async (userId: string) => {
			try {
				setLoading(true);
				const res: any = await createOrFetchPrivateChat(userId);
				if (res?.chat) {
					setActiveWindow(activeWindow === 'ai-chat' ? 'all-chats' : activeWindow);
					setOrCreateActiveChat(res?.chat);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[activeWindow, setActiveWindow, setLoading, setOrCreateActiveChat],
	);

	return { createOrFetchDm, loading };
};

export default useCreateOrFetchChat;
