import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import { Chat } from '@/types/chat';
import { useEffect, useRef } from 'react';
import ChatInput from './chat-input';
import Message from './chat-message';

type ChatMessageContainerProps = {
	chat: Chat;
};

const ChatMessageContainer = ({ chat }: ChatMessageContainerProps) => {
	return (
		<section className='flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden  pb-2'>
			<div className='p-4 max-h-[90%] overflow-y-auto'>
				<Messages chat={chat} />
			</div>

			<div className='sticky bottom-0 top-full p-3 w-full'>
				<ChatInput chatId={chat?._id?.toString()} />
			</div>
		</section>
	);
};

type MessagesProps = ChatMessageContainerProps;

const Messages = ({ chat }: MessagesProps) => {
	const { messages, loading } = useFetchMessages(chat?._id as string);
	const { user } = useAuthInfo();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const getSender = (senderId: string) => (user?._id === senderId ? 'self' : 'other');

	useEffect(() => {
		messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages?.length]);

	return (
		<div className='flex flex-col gap-3 h-full' onScroll={console.log}>
			{loading && (
				<div className='w-full flex items-center justify-center animate-pulse text-white font-medium'>
					Loading chat messages ...
				</div>
			)}
			{!loading &&
				messages?.map((message, index) => (
					<Message
						key={message._id}
						sender={getSender(message?.sender?._id)}
						showAvatar={messages[index + 1]?.sender?._id !== message.sender?._id}
						showUsername={messages[index - 1]?.sender?._id !== message.sender?._id}
						message={message}
						chat={chat}
					/>
				))}
			{!loading && <div ref={messagesEndRef} />}
		</div>
	);
};

export default ChatMessageContainer;
