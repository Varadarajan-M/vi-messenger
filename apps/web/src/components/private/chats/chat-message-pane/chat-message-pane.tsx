import { Fragment, useState } from 'react';
import OfflineIndicator from '@/components/OfflineIndicator';
import AIChatHeader from '@/components/ai-chat/ai-chat-header';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useActiveWindow from '@/hooks/chat/useActiveWindow';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import useOnlineStatus from '@/hooks/common/useOnlineStatus';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { useOnlineUsers } from '@/zustand/store';
import ChatEmptyPane from './chat-empty-pane';
import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';
import AIMessageContainer from '@/components/ai-chat/ai-chat-container';

const ChatMessagePane = () => {
	const isOnline = useOnlineStatus();
	const { chat: chatId, resetChat } = useActiveChat();
	const [chat, setChat] = useState<Chat>({} as Chat);
	const onlineUsers = useOnlineUsers((state) => state.onlineUsers);
	const isSmallScreen = useMediaQuery('( max-width: 900px )');

	const { activeWindow } = useActiveWindow();

	const isAiChat = activeWindow === 'ai-chat';

	const classNames = cn('h-full flex-1 bg-black flex flex-col', {
		hidden: isSmallScreen && !chatId,
		'w-full': isSmallScreen && chatId,
		'pt-5 px-7': !isSmallScreen,
		'pt-3 px-2 ': isSmallScreen,
	});

	if (!chatId && !isSmallScreen) return <ChatEmptyPane />;

	if (chatId) {
		if (!isOnline) return <OfflineIndicator />;

		return (
			<section className={classNames}>
				{isAiChat ? (
					<Fragment>
						<AIChatHeader onBackNavigation={resetChat} />
						<AIMessageContainer />
					</Fragment>
				) : (
					<Fragment>
						<ChatHeader
							onBackNavigation={resetChat}
							chatId={chatId}
							onlineUsers={onlineUsers}
							setChat={setChat}
						/>

						<ChatMessageContainer chatId={chatId} chat={chat!} />
					</Fragment>
				)}
			</section>
		);
	}
};

export default ChatMessagePane;
