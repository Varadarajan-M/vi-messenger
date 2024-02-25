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

		const [users, groups] = await Promise.all([
			User.find({
				$or: [{ username: { $search: q } }, { email: { $search: q } }],
			}).select('-password'),
			Chat.find({
				name: { $search: q },
				members: { $in: req?.user?._id },
			}),
		]);

		return {
			ok: true,
			payload: {
				users,
				groups,
			},
		};
	} catch (error: any) {
		res.json({ ok: false, error: error?.message });
	}
};
