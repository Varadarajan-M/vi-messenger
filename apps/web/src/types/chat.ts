import { Message } from './message';

export interface Chat {
	_id: string | number;
	name: string;
	members: string[];
	lastMessage: Message;
	admin: string;
	avatar: string;
}
