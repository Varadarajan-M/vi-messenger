export interface AuthFormData {
	email: string;
	password: string;
	username: string;
}

export interface User {
	_id: string;
	username: string;
	email: string;
	picture: string;
	token: string;
}
