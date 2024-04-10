import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import Chat from './models/chat';
import Message from './models/message';
import { SocketWithUser } from './types';
import logger from './utils/logger';

const onlineUsers: any = {};

const addToOnlineUsers = (user: any) => {
	logger.info(`Adding ${user.username} to online users...`);
	onlineUsers[user._id] = [user?.socketId, user?.username];
	logger.info(`onlineUsers: ${JSON.stringify(onlineUsers, null, 2)}`);
};
const removeFromOnlineUsers = (userId: string) => {
	logger.info(`Removing ${userId} from online users...`);
	delete onlineUsers[userId];
	logger.info(`onlineUsers: ${JSON.stringify(onlineUsers, null, 2)}`);
};

const initSocket = (io: Server) => {
	io.use((socket: SocketWithUser, next) => {
		const token = socket.handshake?.auth?.token;
		if (!token) return next(new Error('Authentication error'));

		verify(
			socket.handshake?.auth?.token,
			process.env.JWT_SECRET as string,
			(err: any, user: any) => {
				if (err) return next(new Error('Authentication error'));
				socket.user = user;
				return next();
			},
		);
	});

	io.on('connection', (socket: SocketWithUser) => {
		logger.info(`Client connected with id: ${socket.id}`);

		socket.emit('connected');

		socket.on('join_online', () => {
			socket.join(socket.user?._id);
			addToOnlineUsers({ socketId: socket.id, ...socket.user });
		});

		socket.on('join_chat', (roomId: string) => {
			socket.join(roomId);
			console.log('evt: join_chat user joined', socket?.user?.username, roomId);
		});

		socket.on(
			'new_message',
			async ({ roomId, message }: { roomId: string; message: string }) => {
				socket.to(roomId).emit('chat_message', message);
				const currentChat = await Chat.findOne({ _id: roomId }, { members: 1 });

				currentChat?.members.forEach((member: any) => {
					const memberId = member.toString();
					if (onlineUsers[memberId] && memberId !== socket?.user?._id) {
						io.to(memberId).emit('chat_update', message);
						console.log('emitted to', memberId);
					}
				});
			},
		);

		socket.on('message_seen', async (msgIds: string[]) => {
			logger.info(`received message_seen; msgIds: ${JSON.stringify(msgIds, null, 2)}`);
			for await (const msgId of msgIds) {
				const currentUserId = new mongoose.Types.ObjectId(socket?.user?._id);
				console.log('currentUserId:', currentUserId);
				const updatedMessage = await Message.findOneAndUpdate(
					{ _id: msgId },
					{ $addToSet: { seenBy: currentUserId } },
					{ new: true },
				);
				if (onlineUsers[updatedMessage?.sender?.toString()!]) {
					socket
						.to(updatedMessage?.sender?.toString()!)
						?.emit('message_seen_ack', updatedMessage);
					logger.info(
						`sent message_seen_ack: ${JSON.stringify(updatedMessage, null, 2)}`,
					);
				}
			}
		});

		socket.on('leave_chat', (roomId: string) => {
			console.log('evt:leave_chat user left', socket?.user?.username, roomId);
			socket.leave(roomId);
		});

		socket.on('disconnect', () => {
			logger.info(`Client disconnected with id: ${socket.id}`);
			socket.leave(socket.user?._id);
			removeFromOnlineUsers(socket.user?._id);
		});
	});
};

export default initSocket;
