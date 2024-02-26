import { NextFunction, Response } from 'express';

import { getChatIfAdmin, getChatIfMember } from '../utils/chat';

import { RequestWithChat } from '../types';

/**
 * Middleware which checks admin privilege for chat access and sets the chat in the request object.
 *
 * @param {RequestWithChat} req - the request object with chat information
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function in the middleware chain
 * @return {Promise<void>} Promise that resolves when the function completes
 */
export const checkAdminPrivilege = async (
	req: RequestWithChat,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { id: chatId } = req.params;

		if (!chatId) {
			res.status(400);
			throw new Error('Invalid Chat ID');
		}

		const loggedInUserId = req?.user?._id;

		const chat = await getChatIfAdmin(chatId, loggedInUserId);

		if (!chat) {
			res.status(403);
			throw new Error('You can only access this resource if you are an admin of this chat');
		}

		req.chat = chat;

		next();
	} catch (error: any) {
		if (!res.statusCode) res.status(500);

		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Something went wrong';

		res.json({
			ok: false,
			error: msg,
		});
	}
};

/**
 * Middleware which checks the membership of the logged in user in a chat and sets the chat in the request object.
 *
 * @param {RequestWithChat} req - the request object with chat information
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function to be called
 * @return {Promise<void>} Promise that resolves when the membership is checked and the chat is set in the request object
 */
export const checkMembership = async (req: RequestWithChat, res: Response, next: NextFunction) => {
	try {
		const { id: chatId } = req.params;

		if (!chatId) {
			res.status(400);
			throw new Error('Invalid Chat ID');
		}

		const loggedInUserId = req?.user?._id;

		const chat = await getChatIfMember(chatId, loggedInUserId);

		if (!chat) {
			res.status(403);
			throw new Error('You can only access this resource if you are a member of this chat');
		}

		req.chat = chat;

		next();
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Something went wrong';

		res.json({
			ok: false,
			error: msg,
		});
	}
};
