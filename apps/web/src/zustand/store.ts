import { create } from 'zustand';

import { getUserChats } from '@/api/chat';

import { getChatMessages } from '@/api/message';
import { Chat } from '@/types/chat';
import { Message } from '@/types/message';

type ChatStore = {
	chats: Partial<Chat>[];
	setChats: (chats: Chat[]) => void;
	addToChats: (chat: Chat) => void;

	loading: boolean;
	setLoading: (loading: boolean) => void;

	findByIdAndUpdate: (id: string, update: Partial<Chat>) => void;

	fetchChats: () => Promise<void>;
};

export const useChatsStore = create<ChatStore>((set, get) => ({
	chats: [],
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

	findByIdAndUpdate(id: string, update: Partial<Chat>) {
		set({
			chats: get().chats.map((chat) => (chat?._id === id ? { ...chat, ...update } : chat)),
		});
	},
}));

type MessageStore = {
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	fetchMessages: (chatId: string) => Promise<void>;
	addMessage: (message: Message) => void;
	findByIdAndUpdate: (id: string, update: Partial<Message>) => void;
	findByIdAndRemove: (id: string) => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
	messages: [],
	setMessages: (messages) => set({ messages }),
	loading: false,
	setLoading: (loading) => set({ loading }),
	fetchMessages: async (chatId: string) => {
		try {
			set({ loading: true });
			const res = (await getChatMessages(chatId)) as any;
			set({ messages: res?.messages });
		} catch (error) {
			console.log(error);
		} finally {
			set({ loading: false });
		}
	},
	findByIdAndUpdate(id: string, update: Partial<Message>) {
		set({
			messages: get().messages.map((message) =>
				message._id === id ? { ...message, ...update } : message,
			),
		});
	},
	findByIdAndRemove(id: string) {
		set({ messages: get().messages.filter((message) => message._id !== id) });
	},
	addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
}));