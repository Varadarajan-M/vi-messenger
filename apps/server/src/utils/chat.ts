import { ObjectId } from 'mongoose';
import Chat from '../models/chat';
import User, { Roles } from '../models/user';
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

export const findOrCreateAIChatForUser = async (userId: string) => {
	try {
		const VIM_AI = await User.findOne({ role: Roles.VIM_AI }).lean();

		if (!VIM_AI) return false;

		const chat = await Chat.findOne({ members: { $all: [userId, VIM_AI._id], $size: 2 } });

		if (chat) return chat;

		const newChat = new Chat({
			members: [userId, VIM_AI._id],
			name: 'AI Chat',
		});

		await newChat.save();

		return newChat;
	} catch (error) {
		return false;
	}
};
