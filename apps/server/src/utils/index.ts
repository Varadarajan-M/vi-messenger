import bcrypt from 'bcrypt';
import User, { Roles } from '../models/user';
import Logger from './logger';

export const range = (start: number = 0, end: number, step = 1) => {
	let res: number[] = [];
	if (start < end) {
		for (let i = start; i < end; i += step) {
			res.push(i);
		}
	} else {
		for (let i = end; i > start; i -= step) {
			res.push(i);
		}
	}
	return res;
};

export const EMAIL_REGEX =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const PASSWD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i;

export const isEmailValid = (email: string) => EMAIL_REGEX.test(email);

export const isPasswordValid = (password: string) => PASSWD_REGEX.test(password);

export const isUsernameValid = (username: string) => {
	if (!username || username?.trim().length < 3) {
		return false;
	}
	return true;
};

export const seedAIUserInDatabase = async () => {
	try {
		const user = await User.findOne({ role: 'vim-ai' });
		if (user) return Logger.info('Skipping AI User seeding as it already exists...');

		const { VIM_AI_USERNAME, VIM_AI_EMAIL, VIM_AI_PASSWORD } = process.env;

		if (!VIM_AI_USERNAME || !VIM_AI_EMAIL || !VIM_AI_PASSWORD) {
			return Logger.error(
				'Failed to configure AI User as one of the required credentials are missing...',
			);
		}
		const ai = new User({
			username: VIM_AI_USERNAME,
			email: VIM_AI_EMAIL,
			password: await bcrypt.hash(VIM_AI_PASSWORD, 5),
			role: Roles.VIM_AI,
		});

		await ai.save();

		Logger.info('AI User seeded successfully...');
	} catch (error: any) {
		Logger.error('Failed to seed AI User: ' + error?.message);
	}
};

export const updateUserRoleMigration = async () => {
	try {
		const update = await User.updateMany(
			{
				role: { $nin: [Roles.VIM_AI, Roles.USER] },
			},
			{
				$set: { role: Roles.USER },
			},
		);
		if (update.modifiedCount > 0) Logger.info(`Updated ${update.modifiedCount} user roles`);
		else Logger.info('Skipping user role update as no records matched');
	} catch (error: any) {
		Logger.error('Failed to update user roles: ' + error?.message);
	}
};
