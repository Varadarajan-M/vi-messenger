export interface Chat {
	_id: string | number;
	name: string;
	members: string[];
	lastMessage: string;
	admin: string;
	avatar: string;
}
