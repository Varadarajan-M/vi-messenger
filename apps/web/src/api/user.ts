import api from '@/lib/axios';
import axios from 'axios';

export const findUsers = async (username: string) => {
	try {
		const res = await api.get(`/user?username=${username ?? ''}`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const updateUsername = async (value: string) => {
	try {
		const res = await api.put(`/user/update/username`, { username: value });
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const updatePassword = async (value: string) => {
	try {
		const res = await api.put(`/user/update/password`, { password: value });
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const deleteUser = async () => {
	try {
		const res = await api.delete(`/user/delete`);
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const uploadToCloudinary = async (file: File) => {
	try {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', 'vdth9cfm');
		const res = await axios.post('https://api.cloudinary.com/v1_1/dsyrltebn/upload', formData);
		return res?.data ?? null;
	} catch (err) {
		console.log(err);
		return err;
	}
};

export const uploadProfilePicture = async (picture: string) => {
	try {
		const res = await api.put(`/user/update/picture`, { picture });
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
};
