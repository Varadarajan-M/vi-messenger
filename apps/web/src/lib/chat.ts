import { User } from '@/types/auth';
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
