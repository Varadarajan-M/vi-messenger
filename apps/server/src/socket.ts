import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import Chat from './models/chat';
import Message from './models/message';
import { SocketWithUser } from './types';

const onlineUsers: any = {};
const typingState: any = {};

const addToOnlineUsers = (user: any) => {
	onlineUsers[user._id] = [user?.socketId, user?.username];
};
const removeFromOnlineUsers = (userId: string) => {
	delete onlineUsers[userId];
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
		socket.emit('connected');

		socket.on('join_online', () => {
			socket.join(socket.user?._id);
			addToOnlineUsers({ socketId: socket.id, ...socket.user });
			io.emit('update_online_users', onlineUsers);
		});

		socket.on('join_chat', (roomId: string) => {
			socket.join(roomId);
		});

		socket.on('type_start', (data: { userId: string; chatId: string }) => {
			typingState[data?.chatId] = {
				...(typingState[data?.chatId] ?? {}),
				[data.userId]: onlineUsers?.[data.userId]?.[1] ?? 'User',
			};
			socket.to(data?.chatId).emit('update_typing_status', typingState);
		});

		socket.on('type_end', (data: { userId: string; chatId: string }) => {
			delete typingState[data?.chatId]?.[data.userId];
			socket.to(data?.chatId).emit('update_typing_status', typingState);
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
					}
				});
			},
		);

		socket.on('message_seen', async (msgIds: string[]) => {
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
						.to(updatedMessage?.chatId?.toString() || '')
						?.emit('message_seen_ack', updatedMessage);
				}
			}
		});

		socket.on('leave_chat', (roomId: string) => {
			socket.leave(roomId);
		});

		socket.on('disconnect', () => {
			socket.leave(socket.user?._id);
			removeFromOnlineUsers(socket.user?._id);
			io.emit('update_online_users', onlineUsers);
		});
	});
};

export default initSocket;
