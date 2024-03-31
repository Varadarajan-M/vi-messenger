import { createOrFetchPrivateChat } from '@/api/chat';
import { useChatsStore } from '@/zustand/store';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useCreateOrFetchChat = () => {
	const addToChats = useChatsStore((state) => state.addToChats);
	const chats = useChatsStore((state) => state.chats);
	const loading = useChatsStore((state) => state.loading);
	const setLoading = useChatsStore((state) => state.setLoading);

	const [searchParams, setSearchParams] = useSearchParams();

	const createOrFetchDm = useCallback(
		async (userId: string) => {
			try {
				setLoading(true);
				const res: any = await createOrFetchPrivateChat(userId);
				if (res?.chat) {
					const chat = chats.find((chat) => chat?._id === res?.chat._id);
					if (!chat) {
						addToChats(res?.chat);
					}
					searchParams.set('chat', res?.chat?._id?.toString());
					setSearchParams(searchParams.toString());
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		},
		[addToChats, chats, searchParams, setLoading, setSearchParams],
	);

	return { createOrFetchDm, loading };
};

export default useCreateOrFetchChat;
