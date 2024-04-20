import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useTypingStatus from '@/hooks/chat/useTypingStatus';
import useDeleteMessage from '@/hooks/messages/useDeleteMessage';
import useEditMessage from '@/hooks/messages/useEditMessage';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import useUnreadMessagesDisplay from '@/hooks/messages/useUnreadMessagesDisplay';
import { Chat } from '@/types/chat';
import { Fragment, useEffect, useRef } from 'react';
import ChatInput from './chat-input';
import Message from './message/chat-message';
import useReactToMessage from '@/hooks/messages/useReactToMessage';

type ChatMessageContainerProps = {
	chat: Chat;
};

const TypingIndicator = ({ chatId }: { chatId: string }) => {
	const { typingState, message } = useTypingStatus(chatId as string);

	return typingState?.[chatId] ? (
		<p className='m-0 mt-1 text-gray-300 rounded-lg bg-transparent underline text-opacity-90 font-medium w-full h-6 pl-4 animate-pulse'>
			{message}
		</p>
	) : null;
};

const ChatMessageContainer = ({ chat }: ChatMessageContainerProps) => {
	return (
		<section className='flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden  pb-2'>
			<div className='p-4 max-h-[90%] overflow-y-auto' id='scrollable-messages-container'>
				<Messages chat={chat} />
			</div>

			<TypingIndicator chatId={chat?._id?.toString()} />

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
	const { msgDisplayRef, unReadMessages } = useUnreadMessagesDisplay(chat?._id as string);
	const onDeleteMessage = useDeleteMessage();
	const onEditMessage = useEditMessage();
	const onReactToMessage = useReactToMessage();

	const getSender = (senderId: string) => (user?._id === senderId ? 'self' : 'other');

	const scrollToNewMessage = () => {
		setTimeout(() => {
			if (messagesEndRef?.current)
				messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
		}, 200);
	};

	useEffect(() => {
		if (!unReadMessages?.length) {
			scrollToNewMessage();
		}
	}, [unReadMessages?.length, messages.length]);

	return (
		<div className='flex flex-col gap-8 h-full py-16'>
			{loading && (
				<div className='w-full flex items-center justify-center animate-pulse text-white font-medium'>
					Loading chat messages ...
				</div>
			)}
			{!loading &&
				messages?.map((message, index) => (
					<Fragment key={message._id}>
						{unReadMessages?.[0] === message?._id && (
							<p
								ref={msgDisplayRef}
								className='m-0 animate-pulse text-gray-300 underline  text-opacity-90 font-medium w-full p-4 text-center'
							>
								{`${unReadMessages?.length} new messages`}
							</p>
						)}
						<Message
							sender={getSender(message?.sender?._id)}
							showAvatar={messages[index + 1]?.sender?._id !== message.sender?._id}
							showUsername={
								getSender(message?.sender?._id) === 'other' &&
								messages[index - 1]?.sender?._id !== message.sender?._id
							}
							message={message}
							chat={chat}
							onDelete={onDeleteMessage}
							onEdit={onEditMessage}
							onReact={onReactToMessage}
						/>
					</Fragment>
				))}

			{!loading && <div ref={messagesEndRef} />}
		</div>
	);
};

export default ChatMessageContainer;
