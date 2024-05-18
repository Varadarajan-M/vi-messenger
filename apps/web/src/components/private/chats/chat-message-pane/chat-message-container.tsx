import { Button } from '@/components/ui/button';
import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useDeleteMessage from '@/hooks/messages/useDeleteMessage';
import useEditMessage from '@/hooks/messages/useEditMessage';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import useReactToMessage from '@/hooks/messages/useReactToMessage';
import useUnreadMessagesDisplay from '@/hooks/messages/useUnreadMessagesDisplay';
import { getMessageSenderText } from '@/lib/chat';
import { getDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import type { Message as MessageType } from '@/types/message';
import { ArrowDownIcon, CrossCircledIcon } from '@radix-ui/react-icons';
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
import { MessageReplyRenderer } from './message/renderer';

type ChatMessageContainerProps = {
	chat: Chat;
	chatId: string;
};

const ReplyingToMessagePreview = ({
	message,
	onClose,
}: {
	message: MessageType | null;
	onClose: () => void;
}) => {
	if (!message) return null;

	const messageSender = getMessageSenderText(message?.sender as any);
	return (
		<div className='absolute bottom-[10px] left-0 w-full z-[9999] bg-black'>
			<div
				className={cn(
					'flex flex-col z-[9999] relative bg-dark-grey bg-opacity-30 justify-center gap-0.3 mt-3 mx-4 p-2 h-20   min-h-20 rounded-lg border-l-8 shadow-lg overflow-hidden',
					{
						'border-l-cyan-700': messageSender === 'You',
						'border-l-purple-600': messageSender !== 'You',
					},
				)}
			>
				<div className='max-w-[95%]'>
					<p className='text-md font-semibold text-gray-400'>{messageSender}</p>
					<MessageReplyRenderer
						type={message?.type as any}
						content={message?.content as any}
					/>
					<CrossCircledIcon
						onClick={onClose}
						className='w-8 h-8 absolute top-2 right-2 text-gray-500 bg-gray-900 rounded-full p-1 cursor-pointer'
					/>
				</div>
			</div>
		</div>
	);
};

const ChatMessageContainer = ({ chat, chatId }: ChatMessageContainerProps) => {
	const lastMessageRef = useRef<any>(null);
	const chatInputRef = useRef<any>(null);
	const { user } = useAuthInfo();
	const [replyTo, setReplyTo] = useState<MessageType | null>(null);

	const onSendMessage = useCallback(
		(message?: MessageType) => {
			if (lastMessageRef?.current) {
				lastMessageRef?.current?.scrollToNewMessage();
			}
			// this fixes the issue where you would reply to some message the selection gets reset on receiving a new message
			if (message?.sender?._id === user?._id) {
				setReplyTo(null);
			}
		},
		[user?._id],
	);

	const onReplyTo = useCallback((message: MessageType | null) => {
		setReplyTo(message);
		chatInputRef?.current?.focus();
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
		<>
			<section
				className={cn(
					'flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden',
					{
						'pb-24': replyTo,
						'pb-6': !replyTo,
					},
				)}
			>
				<div
					className='p-4 max-h-[98%] h-[98%] overflow-y-auto'
					id='scrollable-messages-container'
				>
					<Messages
						key={chatId}
						chat={chat}
						chatId={chatId}
						ref={lastMessageRef}
						onReply={onReplyTo}
					/>
				</div>

				{replyTo && (
					<ReplyingToMessagePreview message={replyTo} onClose={() => setReplyTo(null)} />
				)}
			</section>
			<div className='sticky bottom-0 top-full py-3 w-full'>
				<ChatInput
					chatId={chat?._id?.toString()}
					onSendMessage={onSendMessage}
					replyingTo={replyTo}
					messageInputRef={chatInputRef}
				/>
			</div>
		</>
	);
};

type MessagesProps = ChatMessageContainerProps & {
	onReply: (replyTo: MessageType | null) => void;
};

export const ChatDateSeparator = ({ date }: { date: string }) => {
	return (
		<span className='rounded-3xl mx-auto justify-self-center dark-b text-gray-300 w-[max-content] underline font-medium px-4 py-2'>
			{date}
		</span>
	);
};

export const ShowPreviousMessages = ({ onClick }: { onClick: () => void }) => {
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

export const PreviousMessageLoader = () => {
	return (
		<div className='w-full flex items-center justify-center animate-pulse text-white font-medium'>
			Loading previous messages...
		</div>
	);
};

export const InitialMessageLoader = () => {
	return (
		<div className='w-full h-full flex items-center justify-center animate-pulse text-white font-medium'>
			Loading chat messages ...
		</div>
	);
};

export const ScrollToBottom = ({ onClick }: { onClick: () => void }) => {
	return (
		<div
			title='Scroll to bottom'
			onClick={onClick}
			className='ml-auto absolute bottom-[20px] bg-black right-5 border-[2px] grid place-content-center rounded-full border-purple-900 hover:border-red-500 w-[42px] h-[42px] hover:scale-125 transition-all duration-300 text-white'
		>
			<ArrowDownIcon className='w-5 h-5' />
		</div>
	);
};

export const EmptyMessagePanel = () => {
	return (
		<div className='flex flex-col items-center justify-center m-0 p-4 h-full'>
			<h3 className='font-extrabold text-white text-2xl'>No messages yet.</h3>
			<p className='text-center text-gray-400 font-medium -mt-2 p-4'>
				Maybe start a new conversation?
			</p>
		</div>
	);
};

const Messages = forwardRef(({ chat, chatId, onReply }: MessagesProps, ref: any) => {
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
			{!loading && messages.length === 0 && <EmptyMessagePanel />}
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
						onReply={onReply}
					/>
				</Fragment>
			))}
			{!loading && messages.length > 0 && <ScrollToBottom onClick={scrollToNewMessage} />}
			{!loading && <div ref={lastMessageRef} />}
		</div>
	);
});

export default ChatMessageContainer;
