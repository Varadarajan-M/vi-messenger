import api from '@/lib/axios';
import { Message } from '@/types/message';

export const getChatMessages = async (chatId: string) => {
	try {
		const res = await api.get(`/message/${chatId}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const sendMessage = async (chatId: string, type: string, content: Message['content']) => {
	try {
		const res = await api.post(`/message/${chatId}`, { type, content });
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const editMessage = async (messageId: string, chatId: string, message: string) => {
	try {
		const res = await api.patch(`/message/${chatId}/${messageId}`, { message });
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const getUnreadMessages = async (chatId: string) => {
	try {
		const res = await api.get(`/message/unread/${chatId}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const deleteMessage = async (messageId: string, chatId: string) => {
	try {
		const res = await api.delete(`/message/${chatId}/${messageId}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const getMessageReactions = async (chatId: string, messageId: string) => {
	try {
		const res = await api.get(`/message/${chatId}/${messageId}/reactions`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};
