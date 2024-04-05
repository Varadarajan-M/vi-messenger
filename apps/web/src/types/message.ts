export interface Message {
	_id: string;
	content: string;
	type: 'text' | 'image' | 'gif';
	sender: MessageUser;
	chatId: string;
	seenBy: string[]; // Assuming seenBy is an array of user IDs (strings)
	createdAt: string; // Date in ISO 8601 format
	updatedAt: string; // Date in ISO 8601 format
}

interface MessageUser {
	_id: string;
	username: string;
	email: string;
	createdAt: string; // Date in ISO 8601 format
	updatedAt: string; // Date in ISO 8601 format
}
