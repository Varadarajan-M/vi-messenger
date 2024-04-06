import ChatSearch from '../chat-search/chat-search';
import CreateGroupChat from '../create-group-chat/create-group-chat';

const ChatListPaneHeader = () => {
	return (
		<div className='flex items-center justify-between gap-2'>
			<ChatSearch />
			<CreateGroupChat />
		</div>
	);
};

export default ChatListPaneHeader;
