import api from '@/lib/axios';

export const getChatMessages = async (chatId: string) => {
	try {
		const res = await api.get(`/message/${chatId}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const sendMessage = async (chatId: string, type: string, content: string) => {
	try {
		const res = await api.post(`/message/${chatId}`, { type, content });
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
