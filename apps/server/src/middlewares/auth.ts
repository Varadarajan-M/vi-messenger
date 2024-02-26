import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { RequestWithUser } from '../types';

/**
 * Authorizes the user by checking the authorization token in the request headers.
 *
 * @param {RequestWithUser} req - the request object with user information
 * @param {Response} res - the response object
 * @param {NextFunction} next - the next function in the middleware chain
 * @return {Promise<void>} Promise that resolves when the authorization is successful, or rejects with an error message
 */
const authorize = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { authorization } = req.headers;
		const token: string = authorization?.split(' ')?.[1] || '';

		if (!token?.trim()?.length) throw new Error('Authentication Failed');

		verify(token, process.env.JWT_SECRET as string, (err, userDetails) => {
			if (err) {
				throw new Error('Authentication Failed');
			} else {
				req.user = userDetails;
				next();
			}
		});
	} catch (error: any) {
		res.status(401).json({ ok: false, error: error?.message });
	}
};

export default authorize;
