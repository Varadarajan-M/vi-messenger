import AIChatMessage from './ai-chat-message';

const AiChatMessages = () => {
	return (
		<div className='flex flex-col gap-8 h-full py-16'>
			<AIChatMessage sender='ai' />
			<AIChatMessage sender='user' />
			<AIChatMessage sender='ai' />
			<AIChatMessage sender='user' />
			<AIChatMessage sender='ai' />
			<AIChatMessage sender='user' />
			<AIChatMessage sender='ai' />
			<AIChatMessage sender='user' />
			<AIChatMessage sender='ai' />
			<AIChatMessage sender='user' />
		</div>
	);
};

export default AiChatMessages;
