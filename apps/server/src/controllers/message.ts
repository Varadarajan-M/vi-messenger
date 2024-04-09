import { Response } from 'express';
import Message from '../models/message';
import { RequestWithChat } from '../types';

export const getChatMessagesController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const messages = await Message.find({ chatId: req?.chat?._id })
			.sort({ createdAt: 1 })
			.populate('sender', '-password')
			.populate('seenBy', '-password');

		res.status(200).json({ ok: true, payload: { messages } });
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get messages';

		res.json({ ok: false, error: msg });
	}
};

export const createMessageController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const { type, content } = req?.body;

		const { _id: chatId } = req?.chat;
		const { _id: userId } = req?.user;

		let newMessage = new Message({
			chatId,
			sender: userId,
			type,
			content,
			seenBy: [userId],
		});

		await newMessage.save();

		await newMessage.populate('sender', '-password');

		await req.chat.updateOne({ lastMessage: newMessage._id });

		res.status(200).json({ ok: true, payload: { message: newMessage } });
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get messages';

		res.json({ ok: false, error: msg });
	}
};
