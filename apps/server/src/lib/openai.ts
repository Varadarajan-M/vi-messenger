import dotenv from 'dotenv';
import OpenAI from 'openai';
import Logger from '../utils/logger';

let aiRequests = 0;
dotenv.config();

const openai = new OpenAI();

export const getChatCompletion = async (message: string) => {
	const res = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'user', content: message }],
		stream: true,
	});

	aiRequests++;

	Logger.info(`New chat request received, total requests: ${aiRequests}`);

	return res;
};
