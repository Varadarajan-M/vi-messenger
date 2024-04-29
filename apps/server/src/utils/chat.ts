import { ObjectId } from 'mongoose';
import Chat from '../models/chat';

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
