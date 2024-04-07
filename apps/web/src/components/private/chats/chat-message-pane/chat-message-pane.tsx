import { useSearchParams } from 'react-router-dom';

import ChatHeader from './chat-header';
import ChatMessageContainer from './chat-message-container';

const ChatMessagePane = () => {
	const [searchParams] = useSearchParams();

	const chat = searchParams.get('chat') ?? '';

	return (
		<section className='h-full pt-5 px-7 flex-1 bg-black flex flex-col'>
			<ChatHeader  chatId={chat}/>
			<ChatMessageContainer chatId={chat} />
		</section>
	);
};

export default ChatMessagePane;
