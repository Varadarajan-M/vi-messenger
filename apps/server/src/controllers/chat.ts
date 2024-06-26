import { Response } from 'express';

import Chat from '../models/chat';
import Message from '../models/message';
import User from '../models/user';

import { RequestWithChat, RequestWithUser } from '../types';

// ----------------------- CHATS -------------------------

export const getChatController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}
		let chat = await (
			await req?.chat.populate('members', '-password')
		).populate({
			path: 'lastMessage',
			populate: { path: 'sender', select: '-password' },
		});

		if (!chat?.admin) {
			res.setHeader('Cache-Control', 'max-age=120, stale-while-revalidate');
		}

		return res.status(200).json({
			ok: true,
			payload: {
				chat,
			},
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

// ----------------------- ALL CHATS ----------------------

export const getUserChatsController = async (req: RequestWithUser, res: Response) => {
	try {
		const userId = req?.user?._id;

		// TODO: conditionally populate members

		const chats = await Chat.find({
			members: {
				$in: [userId],
			},
			lastMessage: { $exists: true },
		})
			.sort({ updatedAt: -1 })
			.populate('members', '-password')
			.populate({ path: 'lastMessage', populate: { path: 'sender', select: '-password' } })
			.lean();

		let unReadMessageMap: any = {};

		for await (const chat of chats) {
			const unReadMessages = await Message.find({
				chatId: chat._id,
				seenBy: { $nin: [userId] },
			}).select('_id');
			unReadMessageMap[chat._id.toString()] = unReadMessages.map(({ _id }) => _id);
		}

		return res.status(200).json({
			ok: true,
			payload: {
				chats,
				unReadMessages: unReadMessageMap,
			},
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get chats';

		return res.json({
			ok: false,
			error: msg,
		});
	}
};

// ----------------------- PRIVATE CHATS ----------------------

export const getOrCreatePrivateChatController = async (req: RequestWithUser, res: Response) => {
	try {
		const { id: selectedUserId } = req.params;

		if (!selectedUserId || !selectedUserId.length) {
			res.status(400);
			throw new Error('Invalid Chat ID');
		}

		const loggedInUserId = req?.user?._id;

		const existingChat = await Chat.findOne({
			members: {
				$all: [loggedInUserId, selectedUserId],
				$size: 2,
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

export const deletePrivateChatController = async (req: RequestWithChat, res: Response) => {
	try {
		const chat = req.chat;

		await chat?.deleteOne();

		return res.status(200).json({
			ok: true,
			payload: { message: 'Chat deleted' },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to delete chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

// ----------------------- GROUP CHATS ----------------------

export const getGroupChatController = async (req: RequestWithUser, res: Response) => {
	try {
		const { id: groupChatId } = req.params;

		if (!groupChatId || !groupChatId.length) {
			res.status(400);
			throw new Error('Invalid Chat ID');
		}

		const groupChat = await Chat.aggregate([
			{
				$match: {
					_id: groupChatId,
				},
			},
			{
				$addFields: {
					memberCount: {
						$size: '$members',
					},
				},
			},
			{
				$project: {
					members: 0,
				},
			},
		]);

		return res.status(200).json({
			ok: true,
			payload: {
				chat: groupChat?.[0],
			},
		});
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

export const createGroupChatController = async (req: RequestWithUser, res: Response) => {
	try {
		const { name, members } = req.body;

		if (!name || !name?.trim()?.length) {
			res.status(400);
			throw new Error('Invalid Chat Name');
		}

		if (!members || !members?.length) {
			res.status(400);
			throw new Error('Member list must have atleast one member');
		}

		members.push(req?.user?._id);

		const newChat = new Chat({
			name: name?.trim(),
			members: Array.from(new Set(members)),
			admin: req?.user?._id,
		});

		await newChat.save();

		const detailedChat = await User.populate(newChat, {
			path: 'admin members',
			select: '-password',
		});

		res.status(200).json({
			ok: true,
			payload: {
				chat: detailedChat,
			},
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to create group';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

export const updateGroupChatController = async (req: RequestWithChat, res: Response) => {
	try {
		const { name, members } = req.body;

		if (!name || !name?.trim()?.length) {
			res.status(400);
			throw new Error('Invalid Chat Name');
		}

		if (!members?.length || members?.length < 3) {
			res.status(400);
			throw new Error('Member list must have atleast 3 members');
		}

		const chat = req.chat!;

		chat.set({ name: name?.trim(), members: Array.from(new Set(members)) });

		await chat.save();

		res.status(200).json({
			ok: true,
			payload: { chat, message: 'Chat updated' },
		});
		
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to update chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

export const deleteGroupChatController = async (req: RequestWithChat, res: Response) => {
	try {
		const chat = req.chat!;

		// TODO add deletion of chat messages here

		await chat.deleteOne();

		res.status(200).json({
			ok: true,
			payload: { message: 'Chat deleted' },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to delete chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

// ------------------------ GROUP MEMBERS ---------------------

export const getGroupChatMembersController = async (req: RequestWithChat, res: Response) => {
	try {
		const chat = req.chat!;

		return res.status(200).json({
			ok: true,
			payload: {
				members: chat.members!,
				memberCount: chat.members.length,
			},
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get members';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

export const addMembersToGroupChatController = async (req: RequestWithChat, res: Response) => {
	try {
		const { members } = req.body;

		if (!members || !members?.length) {
			res.status(400);
			throw new Error('Members list should have at least one member');
		}

		const chat = req.chat!;

		const updatedChat = await chat.updateOne(
			{
				$addToSet: {
					members: {
						$each: members,
					},
				},
			},
			{
				new: true,
			},
		);

		res.status(200).json({
			ok: true,
			payload: { chat: updatedChat, message: 'Chat updated' },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to add members to chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

export const removeMembersFromGroupChatController = async (req: RequestWithChat, res: Response) => {
	try {
		const { members } = req.body;

		if (!members || !members?.length) {
			res.status(400);
			throw new Error('Members list should have at least one member');
		}

		const chat = req.chat!;

		const updatedChat = await chat.updateOne(
			{
				$pull: {
					members: {
						$in: members,
					},
				},
			},
			{
				new: true,
			},
		);

		res.status(200).json({
			ok: true,
			payload: { chat: updatedChat, message: 'Removed members from chat successfully' },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to remove members from chat';

		res.json({
			ok: false,
			error: msg,
		});
	}
};
