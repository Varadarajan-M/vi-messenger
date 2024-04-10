import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchSingleChat from '@/hooks/chat/useFetchSingleChat';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const { chat: chatId } = useActiveChat();
	const { chat, loading: chatLoading } = useFetchSingleChat(chatId);

	return (
		<section className='h-full pt-5 px-7 flex-1 bg-black flex flex-col'>
			<ChatHeader chat={chat!} loading={chatLoading} />
			<ChatMessageContainer chat={chat!} />
		</section>
	);
};

export default ChatMessagePane;
