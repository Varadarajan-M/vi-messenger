import useActiveChat from '@/hooks/chat/useActiveChat';
import ChatList from './chat-list';

import useMediaQuery from '@/hooks/common/useMediaQuery';
import { cn } from '@/lib/utils';
import ChatListPaneHeader from './chat-list-header';

const ChatListingPane = () => {
	const isSmallScreen = useMediaQuery('( max-width: 768px )');
	const { chat } = useActiveChat();

	const classNames = cn('flex flex-col gap-6 p-5 w-full md:w-[20%] md:min-w-[20rem] h-full', {
		'w-full': isSmallScreen && !chat,
		"hidden": isSmallScreen && chat,
	});

	return (
		<section className={classNames}>
			<ChatListPaneHeader />
			<ChatList />
		</section>
	);
};

export default ChatListingPane;
