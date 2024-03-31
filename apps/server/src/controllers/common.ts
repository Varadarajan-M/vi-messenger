import { Response } from 'express';

import Chat from '../models/chat';
import User from '../models/user';

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
					},
					{
						username: {
							$regex: new RegExp(q, 'i'),
							$not: { $eq: req?.user?.username },
						},
					},
				],
			}).select('-password'),

			Chat.find({
				name: { $regex: new RegExp(q, 'i') },
				members: { $in: req?.user?._id },
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
				: error?.message || 'No results found';

		res.json({
			ok: false,
			error: msg,
		});
	}
};
