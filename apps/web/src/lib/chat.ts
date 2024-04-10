import { User } from '@/types/auth';
import { Chat } from '@/types/chat';
import { getSession } from './auth';

export const getPrivateChatName = (members: User[]) => {
	const session = getSession();

	if (!session?._id) {
		return null;
	}

	const { _id } = session;

	return members?.find((member) => member?._id !== _id)?.username ?? 'DM';
};

export const getMessageSenderText = (sender: User) => {
	const session = getSession();

	if (!session?._id) {
		return null;
	}

	const { _id } = session;

	return sender?._id === _id ? 'You' : sender?.username;
};

export const getChatSenderPrefix = (chat: Chat) => {
	if (chat?.admin) {
		const msgSender = getMessageSenderText(chat?.lastMessage?.sender as any);
		return msgSender ? `${msgSender}:` : '';
	}
	return getMessageSenderText(chat?.lastMessage?.sender as any) === 'You' ? 'You:' : '';
};

export const scrollToChat = (chatId: string) => {
	if (chatId?.trim().length) {
		const chatPreviewEl = document.getElementById(chatId);
		chatPreviewEl?.scrollIntoView({ behavior: 'smooth' });
	}
};
