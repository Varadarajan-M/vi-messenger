import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import { Chat } from '@/types/chat';
import { useMessageStore } from '@/zustand/store';
import { Fragment, useEffect, useRef } from 'react';
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
	const unReadMessagesDisplayRef = useRef<HTMLParagraphElement | null>(null);
	// const [unReadMessages, setUnReadMessages] = useState<string[]>([]);
	const unReadMessages = useMessageStore((state) => state.unReadMessages)?.[chat?._id as string];
	const setChatUnReadMessageList = useMessageStore((state) => state.setChatUnReadMessageList);

	const getSender = (senderId: string) => (user?._id === senderId ? 'self' : 'other');

	const socket = useSocket();

	const scrollToNewMessage = () => {
		if (messagesEndRef?.current)
			messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (unReadMessages?.length > 0) {
			socket?.emit('message_seen', unReadMessages);
			const popupTimer = setTimeout(() => {
				unReadMessagesDisplayRef?.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}, 300);
			const unReadMessagesClearTimer = setTimeout(
				() => setChatUnReadMessageList(chat?._id as string, []),
				8000,
			);

			return () => {
				clearTimeout(popupTimer);
				clearTimeout(unReadMessagesClearTimer);
			};
		}
	}, [chat?._id, setChatUnReadMessageList, socket, unReadMessages]);

	useEffect(() => {
		if (unReadMessages?.length === 0) {
			scrollToNewMessage();
		}
	}, [unReadMessages, messages.length]);

	return (
		<div className='flex flex-col gap-3 h-full py-16'>
			{loading && (
				<div className='w-full flex items-center justify-center animate-pulse text-white font-medium'>
					Loading chat messages ...
				</div>
			)}
			{!loading &&
				messages?.map((message, index) => (
					<Fragment key={message._id}>
						{unReadMessages[0] === message?._id && (
							<p
								ref={unReadMessagesDisplayRef}
								className='m-0 animate-pulse text-gray-300 underline  text-opacity-90 font-medium w-full p-4 text-center'
							>
								{`${unReadMessages?.length} new messages`}
							</p>
						)}
						<Message
							sender={getSender(message?.sender?._id)}
							showAvatar={messages[index + 1]?.sender?._id !== message.sender?._id}
							showUsername={messages[index - 1]?.sender?._id !== message.sender?._id}
							message={message}
							chat={chat}
						/>
					</Fragment>
				))}
			{!loading && <div ref={messagesEndRef} />}
		</div>
	);
};

export default ChatMessageContainer;
