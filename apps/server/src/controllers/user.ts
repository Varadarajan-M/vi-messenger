import { Response } from 'express';

import User from '../models/user';

import { RequestWithUser } from '../types';

export const findUserController = async (req: RequestWithUser, res: Response) => {
	try {
		const { username } = req.query;

		const users = await User.find({
			username: { $regex: username ?? '', $options: 'i' },
		});

		res.json({ ok: true, payload: { users } });
	} catch (error: any) {
		res.json({ ok: false, error: error?.message || 'Fetch users failed' });
	}
};
