import axios from 'axios';
import { getSession } from './auth';

const api = axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? process.env.REACT_APP_API_URL ?? 'http://localhost:5000/api'
			: `http://localhost:5000/api`,
});

api.interceptors.request.use((config) => {
	const session = getSession();
	if (session) {
		config.headers.Authorization = `Bearer ${session.token}`;
	}
	return config;
});

api.interceptors.response.use(
	(res) => {
		if (res?.data?.payload) {
			return res.data?.payload;
		}
	},
	(err) => {
		if (err?.response?.data) {
			return Promise.reject(err.response.data);
		}
		return Promise.reject(err);
	},
);

export default api;
