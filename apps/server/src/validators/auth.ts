import { NextFunction, Request, Response } from 'express';
import {
	isEmailValid,
	isPasswordValid,
	isUsernameValid,
} from '../utils';

export const emailValidator = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email } = req?.body;
		const isValid = isEmailValid(email);
		if (!isValid) throw new Error('Invalid Email');
		next();
	} catch (error: any) {
		res.status(422).json({ ok: false, error: error?.message });
	}
};

export const passwordValidator = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { password } = req?.body;

		const isValid = isPasswordValid(password);

		if (!isValid) {
			let err = 'Invalid Password';
			if (req.path.endsWith('register'))
				err +=
					' Minimum eight characters, at least one uppercase letter, one lowercase letter, one special character and one number required';

			throw new Error(err);
		}

		next();
	} catch (error: any) {
		res.status(422).json({ ok: false, error: error?.message });
	}
};

export const usernameValidator = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username } = req?.body;
		const isValid = isUsernameValid(username);
		if (!isValid)
			throw new Error('Invalid Username, Minimum 3 characters required');

		next();
	} catch (error: any) {
		res.status(422).json({ ok: false, error: error?.message });
	}
};

export const authValidators = [
	usernameValidator,
	emailValidator,
	passwordValidator,
];
