import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import User from '../models/user';

import logger from '../utils/logger';

export const registerController = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			const newUser = new User({
				username,
				email,
				password: await hash(password, 5),
			});
			const resp = await newUser.save();

			logger.log(`NEW USER Registration: - u: ${newUser?.username} e: ${newUser?.email}`);

			res.status(201).json({
				ok: true,
				msg: 'Registration Successful',
				payload: {
					_id: resp._id,
					email: resp.email,
					username: resp.username,
				},
			});
		} else {
			res.status(401);
			throw new Error('User already exists');
		}
	} catch (error: any) {
		res.json({ ok: false, error: error?.message || 'Registration failed' });
	}
};

export const loginController = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const matchingUser = await User.findOne({ email });

		if (!matchingUser) {
			res.status(400);
			throw new Error("That Email doesn't exist in our records, Please signup to continue.");
		}

		const isPasswordMatched = await compare(password, matchingUser?.password!);

		if (!isPasswordMatched) {
			res.status(401);

			logger.log(`USER Login FAIL: - u: ${matchingUser?.username} e: ${matchingUser?.email}`);
			throw new Error('Invalid credentials');
		}

		const token = sign(
			{
				_id: matchingUser?._id,
				email: matchingUser?.email,
				username: matchingUser?.username,
			},
			process.env.JWT_SECRET!,
		);

		logger.log(`USER Login SUCCESS: - u: ${matchingUser?.username} e: ${matchingUser?.email}`);

		res.status(200).json({
			ok: true,
			message: 'Login Successful',
			payload: {
				_id: matchingUser?._id,
				email: matchingUser?.email,
				username: matchingUser?.username,
				picture: matchingUser?.picture,
				token,
			},
		});
	} catch (error: any) {
		res.json({ ok: false, error: error?.message || 'Login failed' });
	}
};
