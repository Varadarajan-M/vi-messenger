import { User } from '@/types/auth';
import { Chat } from '@/types/chat';
import { getSession } from './auth';
import { getTextAvatar } from './utils';

export const getChatAvatar = (chat: Chat) => {
	const session = getSession();

	if (!session?._id) {
		return null;
	}

	const { _id } = session;

	if (chat?.members?.length > 2) {
		return chat?.avatar ?? getTextAvatar(chat?.name ?? '');
	} else {
		const member: any = chat?.members?.find((member: any) => member?._id !== _id);

		return member?.picture ?? getTextAvatar(member?.username ?? member?.email ?? '');
	}
};

export const getPrivateChatName = (members: User[]) => {
	const session = getSession();

	if (!session?._id) {
		return null;
	}

	const { _id } = session;

	return members?.find((member) => member?._id !== _id)?.username ?? 'DM';
};

export const getPrivateChatMemberId = (members: User[]) => {
	const session = getSession();

	if (!session?._id) {
		return null;
	}

	const { _id } = session;

	return members?.find((member) => member?._id !== _id)?._id ?? null;
};

export const getMessageSenderText = (sender: User) => {
	const session = getSession();

	if (!session?._id) {
		return null;
	}

	const { _id } = session;

	return sender?._id === _id ? 'You' : sender?.username;
};

export const getGroupChatOnlineUserCount = (
	onlineUsers: Record<string, string[]>,
	members: string[],
) => {
	let count = 0;

	for (let i = 0; i < members.length; i++) {
		if (onlineUsers?.[members[i]]) {
			count += 1;
		}
	}

	return count;
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
