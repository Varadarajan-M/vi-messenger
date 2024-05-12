import useActiveChat from '@/hooks/chat/useActiveChat';
import ChatList from './chat-list';

import OfflineIndicator from '@/components/OfflineIndicator';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import useOnlineStatus from '@/hooks/common/useOnlineStatus';
import { cn } from '@/lib/utils';
import { MobileSidebarContent } from '../chat-sidebar/chat-sidebar';
import ChatListPaneHeader from './chat-list-header';

const ChatListingPane = () => {
	const isSmallScreen = useMediaQuery('( max-width: 900px )');
	const { chat } = useActiveChat();
	const isOnline = useOnlineStatus();

	const classNames = cn(
		'flex flex-col gap-6 p-5 w-full tablet:w-[20%] tablet:min-w-[20rem] h-full',
		{
			'w-full': isSmallScreen && !chat,
			hidden: isSmallScreen && chat,
		},
	);

	return (
		<section className={classNames}>
			{isSmallScreen && <MobileSidebarContent />}
			<ChatListPaneHeader />
			{isOnline ? <ChatList /> : <OfflineIndicator />}
		</section>
	);
};

export default ChatListingPane;
