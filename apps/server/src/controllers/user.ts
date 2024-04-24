import crypto from 'crypto';
import { Response } from 'express';
import User from '../models/user';

import { hash } from 'bcrypt';
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

const updateUser = async (
	id: string,
	field: 'username' | 'picture' | 'password',
	value: string,
) => {
	const updatedUser = await User?.findOneAndUpdate(
		{ _id: id },
		{ [field]: value },
		{ new: true },
	).select('-password');

	return updatedUser;
};

export const updateUserNameController = async (req: RequestWithUser, res: Response) => {
	try {
		const { username } = req.body;

		let updatedUser = await updateUser(req.user?._id, 'username', username);

		if (!updatedUser) {
			res.status(400);
			throw new Error('Failed to update user');
		}

		return res.status(200).json({
			ok: true,
			payload: { message: 'Username updated successfully', user: updatedUser },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to delete message';
		res.json({ ok: false, error: msg });
	}
};

export const updatePasswordController = async (req: RequestWithUser, res: Response) => {
	try {
		const { password } = req.body;

		const hashedPw = await hash(password, 5);
		const updatedUser = await updateUser(req.user?._id, 'password', hashedPw);

		if (!updatedUser) {
			res.status(400);
			throw new Error('Failed to update password');
		}

		return res.status(200).json({
			ok: true,
			payload: { message: 'Password updated successfully', user: updatedUser },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to update password';
		res.json({ ok: false, error: msg });
	}
};

export const updateProfilePictureController = async (req: RequestWithUser, res: Response) => {
	try {
		const { picture } = req.body;

		const updatedUser = await updateUser(req.user?._id, 'picture', picture);

		if (!updatedUser) {
			res.status(400);
			throw new Error('Failed to update profile picture');
		}

		return res.status(200).json({
			ok: true,
			payload: { message: 'Profile picture updated successfully', user: updatedUser },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to update profile picture';
		res.json({ ok: false, error: msg });
	}
};

export const deleteUserController = async (req: RequestWithUser, res: Response) => {
	try {
		const deletedUser = await User.findOneAndUpdate(
			{ _id: req.user?._id },
			{
				password: await hash(crypto.randomBytes(64).toString('hex'), 5),
				picture: '',
			},
			{
				new: true,
			},
		);

		if (!deletedUser) {
			res.status(400);
			throw new Error('Failed to delete user');
		}

		return res.status(200).json({
			ok: true,
			payload: { message: 'User deleted successfully', user: deletedUser },
		});
	} catch (error: any) {
		if (!res.statusCode) res.status(500);
		const msg =
			res?.statusCode === 500
				? 'Internal server error'
				: error?.message || 'Failed to delete user';
		res.json({ ok: false, error: msg });
	}
};
