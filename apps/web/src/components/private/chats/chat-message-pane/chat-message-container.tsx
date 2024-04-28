import { Button } from '@/components/ui/button';
import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useTypingStatus from '@/hooks/chat/useTypingStatus';
import useDeleteMessage from '@/hooks/messages/useDeleteMessage';
import useEditMessage from '@/hooks/messages/useEditMessage';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import useReactToMessage from '@/hooks/messages/useReactToMessage';
import useUnreadMessagesDisplay from '@/hooks/messages/useUnreadMessagesDisplay';
import { getDate } from '@/lib/datetime';
import { Chat } from '@/types/chat';
import { ArrowDownIcon } from '@radix-ui/react-icons';
import {
	Fragment,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import ChatInput from './chat-input';
import Message from './message/chat-message';

type ChatMessageContainerProps = {
	chat: Chat;
	chatId: string;
};

const TypingIndicator = ({ chatId }: { chatId: string }) => {
	const { typingState, message } = useTypingStatus(chatId as string);

	return typingState?.[chatId] ? (
		<p className='m-0 mt-1 text-gray-300 rounded-lg bg-transparent underline text-opacity-90 font-medium w-full h-6 pl-4 animate-pulse'>
			{message}
		</p>
	) : null;
};

const ChatMessageContainer = ({ chat, chatId }: ChatMessageContainerProps) => {
	const lastMessageRef = useRef<any>(null);

	const onSendMessage = useCallback(() => {
		if (lastMessageRef?.current) {
			lastMessageRef?.current?.scrollToNewMessage();
		}
	}, []);

	const socket = useSocket();

	useEffect(() => {
		if (socket) {
			socket?.on('chat_message', onSendMessage);

			return () => {
				socket?.off('chat_message', onSendMessage);
			};
		}
	}, [onSendMessage, socket]);

	return (
		<section className='flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden  pb-2'>
			<div
				className='p-4 max-h-[90%] h-[80%] overflow-y-auto'
				id='scrollable-messages-container'
			>
				<Messages key={chatId} chat={chat} chatId={chatId} ref={lastMessageRef} />
			</div>

			<TypingIndicator chatId={chat?._id?.toString()} />

			<div className='sticky bottom-0 top-full p-3 w-full'>
				<ChatInput chatId={chat?._id?.toString()} onSendMessage={onSendMessage} />
			</div>
		</section>
	);
};

type MessagesProps = ChatMessageContainerProps;

const ChatDateSeparator = ({ date }: { date: string }) => {
	return (
		<span className='rounded-3xl mx-auto justify-self-center bg-gray-800  text-gray-300 w-[max-content] underline font-medium px-4 py-2'>
			{date}
		</span>
	);
};

const ShowPreviousMessages = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			onClick={onClick}
			variant={'outline'}
			className='bg-dark-grey w-max mx-auto text-white'
		>
			Show previous messages
		</Button>
	);
};

const PreviousMessageLoader = () => {
	return (
		<div className='w-full flex items-center justify-center animate-pulse text-white font-medium'>
			Loading previous messages...
		</div>
	);
};

const InitialMessageLoader = () => {
	return (
		<div className='w-full flex items-center justify-center animate-pulse text-white font-medium'>
			Loading chat messages ...
		</div>
	);
};

const ScrollToBottom = ({ onClick }: { onClick: () => void }) => {
	return (
		<div
			title='Scroll to bottom'
			onClick={onClick}
			className='ml-auto absolute bottom-[120px] bg-black right-5 border-[2px] grid place-content-center rounded-full border-purple-900 hover:border-red-500 w-[42px] h-[42px] hover:scale-125 transition-all duration-300 text-white'
		>
			<ArrowDownIcon className='w-5 h-5' />
		</div>
	);
};

const Messages = forwardRef(({ chat, chatId }: MessagesProps, ref: any) => {
	const [page, setPage] = useState(1);
	const skip = (page - 1) * 10;
	const { user } = useAuthInfo();
	const lastMessageRef = useRef<any>(null);
	const { msgDisplayRef, unReadMessages } = useUnreadMessagesDisplay(chatId as string);
	const onDeleteMessage = useDeleteMessage();
	const onEditMessage = useEditMessage();
	const onReactToMessage = useReactToMessage();
	const limit = unReadMessages?.length > 10 ? unReadMessages?.length + 5 : 10;
	const isInitial = useRef(true);

	const { messages, loading, totalCount } = useFetchMessages(chatId as string, skip, limit);
	const getSender = (senderId: string) => (user?._id === senderId ? 'self' : 'other');

	const scrollToNewMessage = useCallback(() => {
		setTimeout(() => {
			if (lastMessageRef?.current) {
				lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
			}
		}, 200);
	}, [lastMessageRef]);

	const renderChatDateSeparator = (previousMessage: Message, currentMessage: Message) => {
		const prevMsgDate = getDate(previousMessage?.createdAt ?? '');
		const currMsgDate = getDate(currentMessage?.createdAt ?? '');

		if (prevMsgDate !== currMsgDate) {
			return <ChatDateSeparator date={currMsgDate} />;
		}
	};

	const handleShowPreviousMessages = useCallback(() => {
		if (skip < totalCount) setPage((p) => p + 1);
	}, [skip, totalCount]);

	useImperativeHandle(ref, () => {
		return {
			scrollToNewMessage,
		};
	});

	const canShowPreviousMessages =
		!loading && skip < totalCount && totalCount !== 0 && totalCount !== messages.length;

	// This effect is used for starting the chat at the bottom of the messages container
	useEffect(() => {
		if (isInitial.current && messages.length > 0 && unReadMessages?.length === 0) {
			const container = document.getElementById('scrollable-messages-container')!;
			container && (container.scrollTop = container.scrollHeight);
			isInitial.current = false;
		}
	}, [unReadMessages, isInitial, messages]);

	useEffect(() => {
		if (chatId) isInitial.current = true;
	}, [chatId]);

	useEffect(() => {
		if (unReadMessages?.length > 0) isInitial.current = false;
	}, [unReadMessages?.length]);

	return (
		<div className='flex flex-col gap-8 h-full py-16 '>
			{loading && messages.length === 0 && <InitialMessageLoader />}
			{canShowPreviousMessages && (
				<ShowPreviousMessages onClick={handleShowPreviousMessages} />
			)}
			{loading && messages.length > 0 && <PreviousMessageLoader />}
			{messages?.map((message, index) => (
				<Fragment key={message._id}>
					{unReadMessages?.[0] === message?._id && (
						<p
							ref={msgDisplayRef}
							className='m-0 animate-pulse text-gray-300 underline  text-opacity-90 font-medium w-full p-4 text-center'
						>
							{`${unReadMessages?.length} new messages`}
						</p>
					)}
					{renderChatDateSeparator(messages?.[index - 1], message)}
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
			{<ScrollToBottom onClick={scrollToNewMessage} />}

			{!loading && <div ref={lastMessageRef} />}
		</div>
	);
});

export default ChatMessageContainer;
