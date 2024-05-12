import { NextFunction, Request, Response } from 'express';

export const messageValidator = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id: chatId } = req?.params;

		if (!chatId) {
			res.status(400);
			throw new Error('Invalid Chat ID');
		}

		const { type, content } = req?.body;

		let isValid = false;

		if (isValid && type === 'text') {
			isValid = content?.length > 0;
		}

		if (type === 'image' || type === 'video' || type === 'gif' || type === 'file') {
			isValid = content?.url?.length > 0;
		}

		if (!isValid) {
			res.status(422);
			throw new Error('Invalid Message');
		}

		next();
	} catch (error: any) {
		res.status(422).json({ ok: false, error: error?.message });
	}
};
