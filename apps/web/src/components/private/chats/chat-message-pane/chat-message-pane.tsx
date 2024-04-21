import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchSingleChat from '@/hooks/chat/useFetchSingleChat';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import { cn } from '@/lib/utils';
import { useOnlineUsers } from '@/zustand/store';
import ChatEmptyPane from './chat-empty-pane';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const { chat: chatId, resetChat } = useActiveChat();
	const { chat, loading: chatLoading } = useFetchSingleChat(chatId);
	const onlineUsers = useOnlineUsers((state) => state.onlineUsers);

	const isSmallScreen = useMediaQuery('( max-width: 900px )');

	const classNames = cn('h-full flex-1 bg-black flex flex-col', {
		hidden: isSmallScreen && !chatId,
		'w-full': isSmallScreen && chatId,
		'pt-5 px-7': !isSmallScreen,
		'pt-3 px-2 ': isSmallScreen,
	});

	if (!chatId && !isSmallScreen) return <ChatEmptyPane />;

	if (chatId) {
		return (
			<section className={classNames}>
				<ChatHeader
					onBackNavigation={resetChat}
					chat={chat!}
					loading={chatLoading}
					onlineUsers={onlineUsers}
				/>
				<ChatMessageContainer chat={chat!} />
			</section>
		);
	}
};

export default ChatMessagePane;
