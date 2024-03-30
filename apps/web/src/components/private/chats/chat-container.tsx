import ChatWindow from './chat-detail-pane/chat-window';
import ChatListingPane from './chat-listing-pane/chat-listing-pane';

const ChatsContainer = () => {
	return (
		<main className='flex items-stretch h-full flex-1 bg-dark-grey border-l-0 border-l-gray-300 rounded-l-3xl'>
			<ChatListingPane />
			<ChatWindow />
		</main>
	);
};

export default ChatsContainer;
