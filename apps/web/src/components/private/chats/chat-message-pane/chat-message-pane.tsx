import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchSingleChat from '@/hooks/chat/useFetchSingleChat';
import { useOnlineUsers } from '@/zustand/store';
import ChatEmptyPane from './chat-empty-pane';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const { chat: chatId } = useActiveChat();
	const { chat, loading: chatLoading } = useFetchSingleChat(chatId);
	const onlineUsers = useOnlineUsers((state) => state.onlineUsers);

	if (!chat) return <ChatEmptyPane />;

	return (
		<section className='h-full pt-5 px-7 flex-1 bg-black flex flex-col'>
			<ChatHeader chat={chat!} loading={chatLoading} onlineUsers={onlineUsers} />
			<ChatMessageContainer chat={chat!} />
		</section>
	);
};

export default ChatMessagePane;
