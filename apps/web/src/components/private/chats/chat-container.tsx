import ChatListingPane from './chat-listing-pane/chat-listing-pane';
import ChatMessagePane from './chat-message-pane/chat-message-pane';

const ChatsContainer = () => {
	return (
		<main className='flex items-stretch h-full flex-1 bg-gradient-dark border-l-0 border-l-gray-300 rounded-l-3xl'>
			<ChatListingPane />
			<ChatMessagePane />
		</main>
	);
};

export default ChatsContainer;
