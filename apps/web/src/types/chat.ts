import { User } from './auth';
import { Message } from './message';

export interface Chat {
	_id: string | number;
	name: string;
	members: User[] | string[];
	lastMessage: Message;
	admin: string;
	avatar: string;
}
