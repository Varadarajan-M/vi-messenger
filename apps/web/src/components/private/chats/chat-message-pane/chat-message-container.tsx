import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import ChatInput from './chat-input';
import Message from './chat-message';

type ChatMessageContainerProps = {
	chatId: string;
};

const ChatMessageContainer = ({ chatId }: ChatMessageContainerProps) => {
	return (
		<section className='flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden  pb-2'>
			<div className='p-4 max-h-[90%] overflow-y-auto'>
				<Messages chatId={chatId} />
			</div>

			<div className='sticky bottom-0 top-full p-3 w-full'>
				<ChatInput chatId={chatId} />
			</div>
		</section>
	);
};

const Messages = ({ chatId }: { chatId: string }) => {
	const { messages, loading } = useFetchMessages(chatId);
	const { user } = useAuthInfo();

	const getSender = (senderId: string) => (user?._id === senderId ? 'self' : 'other');

	return (
		<div className='flex flex-col gap-3 h-full'>
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
					/>
				))}
		</div>
	);
};

export default ChatMessageContainer;
