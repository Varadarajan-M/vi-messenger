import ChatList from './chat-list';
import ChatSearch from './chat-search';

const ChatListingPane = () => {
	return (
		<section className='h-full flex flex-col gap-6 p-5 w-[20%] min-w-[20rem]'>
			<ChatSearch />
			<ChatList />
		</section>
	);
};

export default ChatListingPane;
