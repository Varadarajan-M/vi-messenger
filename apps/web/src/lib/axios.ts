import axios from 'axios';
import { getSession } from './auth';

export const BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://vi-messenger.onrender.com/api'
		: `http://localhost:5000/api`;

const api = axios.create({
	baseURL: BASE_URL,
});

axios.defaults.baseURL = BASE_URL;

axios.defaults.headers.post['Authorization'] = `Bearer ${getSession()?.token}`;

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
