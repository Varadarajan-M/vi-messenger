export const EMAIL_REGEX =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const PASSWD_REGEX =
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i;

export const isEmailValid = (email: string) => EMAIL_REGEX.test(email);

export const isPasswordValid = (password: string) =>
	PASSWD_REGEX.test(password);

export const isUsernameValid = (username: string) => {
	if (!username || username?.trim().length < 3) {
		return false;
	}
	return true;
};
