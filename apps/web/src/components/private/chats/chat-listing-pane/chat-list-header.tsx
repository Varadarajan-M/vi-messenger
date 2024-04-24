import useMediaQuery from '@/hooks/common/useMediaQuery';
import { cn } from '@/lib/utils';
import ChatSearch from '../chat-search/chat-search';
import CreateGroupChat from '../create-group-chat/create-group-chat';

const ChatListPaneHeader = () => {
	const isSmallScreen = useMediaQuery('( max-width: 900px )');

	const classes = cn('flex items-center justify-between gap-2', {
		'-mt-8': isSmallScreen,
	});

	return (
		<div className={classes}>
			<ChatSearch />
			<CreateGroupChat />
		</div>
	);
};

export default ChatListPaneHeader;
