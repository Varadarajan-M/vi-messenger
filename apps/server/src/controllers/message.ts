import { Response } from 'express';
import { ChatCompletionMessage } from 'groq-sdk/resources/chat/completions';
import { getChatCompletion } from '../lib/groq';
import Message from '../models/message';
import { RequestWithChat } from '../types';
import Logger from '../utils/logger';
import { messagePopulationFields } from '../utils/message';

export const getChatMessagesController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const skip = req?.query?.skip ? Number(req?.query?.skip) : 0;

		const limit = req?.query?.limit ? Number(req?.query?.limit) : 10;

		const [total, messages] = await Promise.all([
			Message.countDocuments({ chatId: req?.chat?._id }),
			Message.find({ chatId: req?.chat?._id })
				.sort({ createdAt: 'desc' })
				.skip(skip)
				.limit(limit)
				.lean()
				.populate('sender', '-password')
				.populate('seenBy', '-password')
				.populate(messagePopulationFields.replyTo),
		]);

		res.status(200).json({ ok: true, payload: { messages: messages.reverse(), total } });
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

		const { type, content, replyTo } = req?.body;

		const { _id: chatId } = req?.chat;
		const { _id: userId } = req?.user;

		if (replyTo && chatId?.toString() !== replyTo?.chatId) {
			throw new Error('Trying to access another chat message may not work');
		}

		let newMessage = new Message({
			chatId,
			sender: userId,
			type,
			content,
			seenBy: [userId],
			reactions: {
				like: [],
				love: [],
				swag: [],
				fire: [],
				happy: [],
				sad: [],
				angry: [],
			},
			replyTo: replyTo ? replyTo._id : null,
		});

		await newMessage.save();

		await Promise.allSettled([
			(
				await newMessage.populate('sender', '-password')
			).populate(messagePopulationFields.replyTo),
			req.chat.updateOne({ lastMessage: newMessage._id }),
		]);

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

export const chatWithAIController = async (req: RequestWithChat, res: Response) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Cache-Control', 'no-cache');

	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const { content } = req?.body;

		if (!content) {
			res.status(422);
			throw new Error('Content is required');
		}

		const newMessage = await (
			await new Message({
				type: 'text',
				content,
				chatId: req?.chat?._id,
				sender: req?.user?._id,
			}).save()
		).populate('sender', '-password');

		if (!newMessage?._id) {
			res.status(400);
			throw new Error('Failed to create message');
		}

		const conversation = await Message.find({
			chatId: req?.chat?._id,
		})?.lean();

		const chatHistory = conversation?.map((message) => ({
			role: message?.sender?.toString() === req?.user?._id.toString() ? 'user' : 'assistant',
			content:
				typeof message?.content === 'object'
					? JSON.stringify(message?.content)
					: message?.content,
		})) as ChatCompletionMessage[];

		const stream = await getChatCompletion(chatHistory);

		// send initial message
		res.write(
			`data: ${JSON.stringify({ ok: true, type: 'user_message', data: newMessage })}\n\n`,
		);

		res.flush();

		let chunks = '';
		let totalTokenUsage = 0;

		for await (const chunk of stream) {
			let chunkContent = chunk.choices[0]?.delta?.content || '';
			chunks += chunkContent;

			totalTokenUsage = chunk?.x_groq?.usage?.total_tokens || 0;

			// Send each chunk of the AI response

			await new Promise((resolve) => setTimeout(resolve, 10));

			res.write(
				`data: ${JSON.stringify({
					ok: true,
					type: 'ai_message_chunk',
					data: chunkContent,
				})}\n\n`,
			);
			res.flush();
		}

		const aiChat = req?.chat;

		const vimAiId = aiChat?.members.find(
			(member) => member.toString() !== req?.user?._id.toString(),
		);

		const aiMessage = await (
			await new Message({
				type: 'text',
				content: chunks,
				chatId: req?.chat?._id,
				sender: vimAiId,
				replyTo: newMessage._id,
			}).save()
		).populate('sender', '-password');

		// Send the final AI message
		res.write(`data: ${JSON.stringify({ ok: true, type: 'ai_message', data: aiMessage })}\n\n`);

		res.flush();

		res.end();

		Logger.info(
			`Chat with VIM AI! User:- ${req?.user?.username}, Total token usage:- ${totalTokenUsage}`,
		);
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to create chat completions';

		res.write(`data: ${JSON.stringify({ ok: false, error: msg })}\n\n`);
		res.end();
	}
};

export const getUnreadMessagesController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}
		const messages = await (
			await Message.find({
				chatId: req?.chat?._id,
				seenBy: {
					$nin: [req?.user?._id],
				},
			})
				.sort({ createdAt: 1 })
				.select('_id')
				.lean()
		).map(({ _id }) => _id);

		res.status(200).json({ ok: true, payload: { messages } });
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get messages';
	}
};

export const deleteMessageController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const { mid: messageId } = req?.params;

		let message: any = await Message.findOne({ _id: messageId, sender: req?.user?._id });

		if (!message) {
			res.status(400);
			throw new Error('Message not found');
		}

		const isMoreThan7Minutes =
			message && new Date(message?.createdAt) < new Date(Date.now() - 7 * 60 * 1000);

		if (isMoreThan7Minutes) {
			res.status(400);
			throw new Error("Message can't be deleted after 7 minutes of creation...");
		} else {
			message = await Message.findOneAndDelete({ _id: messageId, sender: req?.user?._id });
		}
		return res.status(200).json({ ok: true, payload: { message } });
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to delete message';
		res.json({ ok: false, error: msg });
	}
};

export const updateMessageController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const { mid: messageId } = req?.params;

		const { message: content } = req?.body;

		if (!content) {
			res.status(422);
			throw new Error('Message empty');
		}

		let message: any = await Message.findOne({ _id: messageId, sender: req?.user?._id });

		if (!message) {
			res.status(400);
			throw new Error('Message not found');
		}

		const isMoreThan7Minutes =
			message && new Date(message?.createdAt) < new Date(Date.now() - 7 * 60 * 1000);

		if (isMoreThan7Minutes) {
			res.status(400);
			throw new Error("Message can't be edited after 7 minutes of creation...");
		} else {
			message = await Message.findOneAndUpdate(
				{
					_id: messageId,
					sender: req?.user?._id,
				},
				{
					$set: {
						type: 'text',
						content: content?.toString()?.trimStart(),
					},
				},
				{
					new: true,
				},
			);
		}
		return res.status(200).json({ ok: true, payload: { message } });
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to update message';
		res.json({ ok: false, error: msg });
	}
};

export const getMessageReactionController = async (req: RequestWithChat, res: Response) => {
	try {
		if (!req?.chat) {
			res.status(403);
			throw new Error('Chat not found');
		}

		const { mid: messageId } = req?.params;

		if (!messageId) {
			res.status(400);
			throw new Error('Message not found');
		}

		const reactions = await Message.findOne({
			_id: messageId,
			chatId: req?.chat?._id,
		})
			.select('reactions -_id')
			.populate('reactions', '-password');

		return res.status(200).json({ ok: true, payload: reactions });
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to get message reaction';
		res.json({ ok: false, error: msg });
	}
};
