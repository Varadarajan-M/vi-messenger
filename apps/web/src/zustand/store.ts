import { create } from 'zustand';

import { getChatDetails, getUserChats } from '@/api/chat';

import { getChatMessages } from '@/api/message';
import { Chat } from '@/types/chat';
import { Message, MessageReaction } from '@/types/message';

type ChatStore = {
	chats: Partial<Chat>[];
	setChats: (chats: Chat[]) => void;
	addToChats: (chat: Chat) => void;

	loading: boolean;
	setLoading: (loading: boolean) => void;

	findByIdAndUpdate: (id: string, update: Partial<Chat>) => Promise<void>;

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
			useMessageStore.getState().setUnReadMessages(res?.unReadMessages);
		} catch (error) {
			console.log(error);
		} finally {
			set({ loading: false });
		}
	},

	findByIdAndUpdate: async (id: string, update: Partial<Chat>) => {
		const existingChat = get().chats.find((chat) => chat?._id === id);
		if (!existingChat) {
			const res = (await getChatDetails(id, 'populate=1')) as { chat: Chat };
			res.chat && set({ chats: [res.chat, ...get().chats] });
		} else {
			set({
				chats: get().chats.map((chat) =>
					chat?._id === id ? { ...chat, ...update } : chat,
				),
			});
		}
	},
}));

type MessageStore = {
	messages: Message[];
	setMessages: (messages: Message[]) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	fetchMessages: (chatId: string, skip?: number, limit?: number) => Promise<void>;
	addMessage: (message: Message) => void;
	findByIdAndUpdate: (id: string, update: Partial<Message>) => void;
	findByIdAndRemove: (id: string) => void;
	unReadMessages: Record<string, string[]>;
	setUnReadMessages: (unReadMessages: Record<string, string[]>) => void;
	addToUnReadMessageList: (chatId: string, message: string) => void;
	setChatUnReadMessageList: (chatId: string, messages: string[]) => void;
	toggleReactionOnMessage: (messageId: string, userId: string, reaction: MessageReaction) => void;
	getMessage: (id: string) => Message | undefined;
	totalMessages: number;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
	messages: [],
	totalMessages: 0,
	setMessages: (messages) => set({ messages }),
	loading: false,
	setLoading: (loading) => set({ loading }),
	fetchMessages: async (chatId: string, skip?: number, limit?: number) => {
		try {
			if ((skip ?? 0) <= get()?.totalMessages) {
				set({ loading: true });
				const res = (await getChatMessages(chatId, skip, limit)) as any;

				set({
					totalMessages: res?.total ?? 0,
					messages: !skip
						? res?.messages ?? []
						: [...(res?.messages ?? []), ...(get().messages ?? [])],
				});
			}
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
	unReadMessages: {},
	setUnReadMessages: (unReadMessages) => set({ unReadMessages }),
	addToUnReadMessageList: (chatId: string, message: string) =>
		set({
			unReadMessages: {
				...(get()?.unReadMessages ?? []),
				[chatId]: [...(get()?.unReadMessages?.[chatId] ?? []), message],
			},
		}),
	setChatUnReadMessageList: (chatId: string, messages: string[]) => {
		set({ unReadMessages: { ...(get().unReadMessages ?? []), [chatId]: messages } });
	},
	toggleReactionOnMessage(messageId: string, userId: string, reaction: MessageReaction) {
		set({
			messages: get().messages.map((message) => {
				if (message._id === messageId) {
					return {
						...message,
						reactions: {
							...(message?.reactions ?? {}),
							[reaction]: new Set(message?.reactions?.[reaction] ?? []).has(userId)
								? message?.reactions?.[reaction].filter((id) => id !== userId)
								: [userId, ...(message?.reactions?.[reaction] ?? [])],
						},
					};
				} else {
					return message;
				}
			}) as any,
		});
	},
	getMessage: (id: string) => get().messages.find((message) => message._id === id),
}));

type OnlineUserStore = {
	onlineUsers: Record<string, string[]>;
	setOnlineUsers: (onlineUsers: OnlineUserStore['onlineUsers']) => void;
};

export const useOnlineUsers = create<OnlineUserStore>((set) => ({
	onlineUsers: {},
	setOnlineUsers: (onlineUsers: OnlineUserStore['onlineUsers']) => {
		set({ onlineUsers });
	},
}));

type CurrentlyTyping = {
	[userId: string]: boolean;
};

type TypingStateStore = {
	typingStatus: Record<string, CurrentlyTyping[]>;
	setTypingStatus: (typingStatus: TypingStateStore['typingStatus']) => void;
};

export const useTypingState = create<TypingStateStore>((set) => ({
	typingStatus: {},
	setTypingStatus: (typingStatus: TypingStateStore['typingStatus']) => {
		set({ typingStatus });
	},
}));
