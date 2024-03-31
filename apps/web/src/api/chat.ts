import api from '@/lib/axios';

export const searchChats = async (query: string) => {
	try {
		const res = await api.get(`/common/search/entities?query=${query}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const createOrFetchPrivateChat = async (userId: string) => {
	try {
		const res = await api.post(`/chat/private/${userId}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const getUserChats = async () => {
	try {
		const res = await api.get(`/chat/all`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};
