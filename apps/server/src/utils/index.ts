export const range = (start: number = 0, end: number, step = 1) => {
	let res: number[] = [];
	if (start < end) {
		for (let i = start; i < end; i += step) {
			res.push(i);
		}
	} else {
		for (let i = end; i > start; i -= step) {
			res.push(i);
		}
	}
	return res;
};

export const EMAIL_REGEX =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const PASSWD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i;

export const isEmailValid = (email: string) => EMAIL_REGEX.test(email);

export const isPasswordValid = (password: string) => PASSWD_REGEX.test(password);

export const isUsernameValid = (username: string) => {
	if (!username || username?.trim().length < 3) {
		return false;
	}
	return true;
};
