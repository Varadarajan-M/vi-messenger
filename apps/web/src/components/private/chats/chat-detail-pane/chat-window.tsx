import { useSearchParams } from 'react-router-dom';

const ChatWindow = () => {
	const [searchParams] = useSearchParams();

	const chat = searchParams.get('chat') ?? '';

	return (
		<section className='h-full p-5 flex-1 bg-black'>
			<h3 className='font-extrabold text-white text-3xl mb-10'>
				Active Chat Window : {chat}
			</h3>
		</section>
	);
};

export default ChatWindow;
