export interface Message {
	_id: string;
	content:
		| {
				url: string;
				download: string;
				preview?: string;
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  }
		| string;

	type: 'text' | 'image' | 'gif';
	sender: MessageUser;
	chatId: string;
	seenBy: string[]; // Assuming seenBy is an array of user IDs (strings)
	createdAt: string; // Date in ISO 8601 format
	updatedAt: string; // Date in ISO 8601 format
	reactions?: {
		[key in MessageReaction]: string[];
	};
}

export type MessageReaction = 'like' | 'love' | 'happy' | 'sad' | 'angry' | 'dislike';

interface MessageUser {
	_id: string;
	username: string;
	email: string;
	createdAt: string; // Date in ISO 8601 format
	updatedAt: string; // Date in ISO 8601 format
}
