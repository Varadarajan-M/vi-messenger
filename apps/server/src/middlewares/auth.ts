import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { RequestWithUser } from '../types';

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
