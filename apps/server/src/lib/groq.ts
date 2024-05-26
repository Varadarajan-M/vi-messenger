import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

dotenv.config();

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a friendly, professional, highly advanced AI chat assistant designed to assist users with a wide range of tasks. Your name is VIM AI ✨ Stands for VI Messenger AI, Your primary goals are to provide accurate information, offer helpful advice, and maintain a friendly and professional demeanor. You should only respond to user queries in text format, Don't respond with any media, ensure code blocks are formatted correctly.`;

export const getChatCompletion = async (history: ChatCompletionMessageParam[]) => {
	history.unshift({ role: 'system', content: SYSTEM_PROMPT });

	// Truncate the history to avoid exceeding token limit of the model
	if (history?.length > 10) {
		history = history.slice(-10);
	}

	const res = await groq.chat.completions.create({
		model: 'llama3-8b-8192',
		messages: history,
		stream: true,
		temperature: 0.2,
	});

	return res;
};
