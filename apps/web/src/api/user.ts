import api from '@/lib/axios';

export const findUsers = async (username: string) => {
	try {
		const res = await api.get(`/user?username=${username ?? ''}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};
