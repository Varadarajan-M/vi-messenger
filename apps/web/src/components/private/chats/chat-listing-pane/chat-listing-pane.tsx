import ChatList from './chat-list';

import ChatListPaneHeader from './chat-list-header';

const ChatListingPane = () => {
	return (
		<section className='h-full flex flex-col gap-6 p-5 w-[20%] min-w-[20rem]'>
			<ChatListPaneHeader />
			<ChatList />
		</section>
	);
};

export default ChatListingPane;
