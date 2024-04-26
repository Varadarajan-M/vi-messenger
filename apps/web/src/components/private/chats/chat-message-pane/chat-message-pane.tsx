import useActiveChat from '@/hooks/chat/useActiveChat';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { useOnlineUsers } from '@/zustand/store';
import { useState } from 'react';
import ChatEmptyPane from './chat-empty-pane';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const { chat: chatId, resetChat } = useActiveChat();
	const [chat, setChat] = useState<Chat>({} as Chat);
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
					chatId={chatId}
					onlineUsers={onlineUsers}
					setChat={setChat}
				/>

				<ChatMessageContainer chatId={chatId} chat={chat!} />
			</section>
		);
	}
};

export default ChatMessagePane;
