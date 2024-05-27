import { Response } from 'express';

import Chat from '../models/chat';
import User, { Roles } from '../models/user';

import { RequestWithUser } from '../types';

// Function to handle user and group search requests.
export const searchController = async (req: RequestWithUser, res: Response) => {
	try {
		const { query } = req.query;

		let q = query?.toString()?.trim()?.toLowerCase();

		if (!q || !q.length) {
			res.status(400);
			throw new Error('Invalid Query');
		}

		let [users, groups] = await Promise.all([
			User.find({
				$or: [
					{
						email: {
							$regex: new RegExp(q, 'i'),
							$not: { $eq: req?.user?.email },
						},
						role: { $ne: Roles.VIM_AI },
					},
					{
						username: {
							$regex: new RegExp(q, 'i'),
							$not: { $eq: req?.user?.username },
						},
						role: { $ne: Roles.VIM_AI },
					},
				],
			})
				.lean()
				.select('-password'),

			Chat.find({
				name: { $regex: new RegExp(q, 'i') },
				members: { $in: [req?.user?._id] },
				admin: { $exists: true },
			})
				.lean()
				.populate({
					path: 'admin members',
					select: '-password',
				})
				.populate({
					path: 'lastMessage',
					model: 'Message',
					populate: {
						path: 'sender',
						select: '-password',
						model: 'User',
					},
				}),
		]);

		return res.status(200).json({
			ok: true,
			payload: {
				users,
				groups,
			},
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to search';
		res?.json({ ok: false, error: msg });
	}
};
