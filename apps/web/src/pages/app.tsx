import ChatsContainer from '@/components/private/chats/chat-container';
import ChatSidebar from '@/components/private/chats/chat-sidebar/chat-sidebar';

const AppPage = () => {
	return (
		<section className='chats-home bg-black h-screen w-full overflow-hidden flex'>
			<ChatSidebar />
			<ChatsContainer />
		</section>
	);
};

export default AppPage;
