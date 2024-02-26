import { ObjectId } from 'mongoose';
import Chat from '../models/chat';

/**
 * Checks if the user is an admin in the specified chat and returns it.
 */
export const getChatIfAdmin = async (userId: string, chatId: string | ObjectId) => {
	const chat = await getChatIfMember(chatId, userId);
	return chat?.admin === userId ? chat : false;
};

/**
 * Checks if the given user IDs are all members of the specified chat and returns it.
 */
export const getChatIfMember = async (
	chatId: string | ObjectId,
	...userIds: string[] | ObjectId[]
) =>
	await Chat.findOne({
		_id: chatId,
		members: { $all: userIds },
	});

