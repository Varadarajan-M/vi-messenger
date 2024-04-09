import { Request } from 'express';
import { Socket } from 'socket.io';
import { getChatIfMember } from '../utils/chat';

export interface RequestWithUser extends Request {
	user?: any;
}

export interface RequestWithChat extends RequestWithUser {
	chat?: Awaited<ReturnType<typeof getChatIfMember>>;
}

export interface SocketWithUser extends Socket {
	user?: any;
}
