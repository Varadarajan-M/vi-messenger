import { create } from 'zustand';

import { getUserChats } from '@/api/chat';
import { DUMMY_CHATS } from '@/lib/data';

import { Chat } from '@/types/chat';

type ChatStore = {
	chats: Partial<Chat>[];
	setChats: (chats: Chat[]) => void;
	addToChats: (chat: Chat) => void;

	loading: boolean;
	setLoading: (loading: boolean) => void;

	fetchChats: () => Promise<void>;
};

export const useChatsStore = create<ChatStore>((set, get) => ({
	chats: DUMMY_CHATS,
	setChats: (chats) => set({ chats }),
	addToChats: (chat) => {
		set({ chats: [chat, ...get().chats] });
	},

	loading: false,
	setLoading: (loading) => {
		set({ loading });
	},

	fetchChats: async () => {
		try {
			set({ loading: true });
			const res = (await getUserChats()) as any;
			set({ chats: res?.chats });
		} catch (error) {
			console.log(error);
		} finally {
			set({ loading: false });
		}
	},
}));
