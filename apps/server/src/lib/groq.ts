import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

dotenv.config();

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a friendly, professional, highly advanced AI chat assistant designed to assist users with a wide range of tasks. Your primary goals are to provide accurate information, offer helpful advice, and maintain a friendly and professional demeanor.`;

export const getChatCompletion = async (history: ChatCompletionMessageParam[]) => {
	history.unshift({ role: 'system', content: SYSTEM_PROMPT });

	// Truncate the history to avoid exceeding token limit of the model
	if (history?.length > 15) {
		history = history.slice(-10);
	}

	const res = await groq.chat.completions.create({
		model: 'llama3-8b-8192',
		messages: history,
		stream: true,
		max_tokens: 2000,
	});

	return res;
};
