import { Response } from 'express';

import Chat from '../models/chat';
import User from '../models/user';

import { RequestWithUser } from '../types';

export const findOrCreateChatController = async (
	req: RequestWithUser,
	res: Response,
) => {
	try {
		const { id, type } = req.params;

		if (!id || !id.length) {
			res.status(400);
			throw new Error('Invalid Chat ID');
		}

		if (!type || (type !== 'group' && type !== 'private')) {
			res.status(400);
			throw new Error('Invalid Chat Type');
		}

		switch (type) {
			case 'private':
				// In case of private chats, we get user's id from the frontend
				// If a private chat already exists between the two users, return it

				const selectedUserId = id;
				const loggedInUserId = req?.user?._id;

				const existingChat = await Chat.findOne({
					members: {
						$all: [loggedInUserId, selectedUserId],
					},
				})
					?.lean()
					?.populate('members', '-password');

				if (existingChat) {
					return res.status(200).json({
						ok: true,
						payload: {
							chat: existingChat,
						},
					});
				}

				// If it doesn't exist then create a new chat between the users

				const newChat = new Chat({
					name: 'private',
					members: [loggedInUserId, selectedUserId],
				});

				await newChat.save();

				const detailedChat = await User.populate(newChat, {
					path: 'members',
					select: '-password',
				});

				return res.status(200).json({
					ok: true,
					payload: {
						chat: detailedChat,
					},
				});

			case 'group':
				// In case of group chats, we get chat id directly from the frontend
				// so here we just return the details

				const groupChatId = id;

				const groupChat = await Chat.findById(groupChatId)
					?.lean()
					?.populate('members', '-password');

				return res.status(200).json({
					ok: true,
					payload: {
						chat: groupChat,
					},
				});

			default:
				break;
		}
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to find or create chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};
