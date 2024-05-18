import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useSendMessage from '@/hooks/messages/useSendMessage';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Children, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import AiChatMessages from './ai-chat-messages';

const ContainerLayout = ({ children }: { children: React.ReactNode }) => {
	const [messages, input] = Children.toArray(children);
	return (
		<>
			<section className='flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden  pb-2'>
				<div
					className='p-4 max-h-[98%] h-[98%] overflow-y-auto'
					id='scrollable-messages-container'
				>
					{messages}
				</div>
			</section>
			<div className='sticky bottom-0 top-full py-3  w-full'>{input}</div>
		</>
	);
};

const AIMessageContainer = () => {
	return (
		<ContainerLayout>
			<AiChatMessages />
			<AIMessageInput />
		</ContainerLayout>
	);
};

const AIMessageInput = () => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { onSendMessage } = useSendMessage();
	const { user } = useAuthInfo();
	const handleClick = async () => {
		if (inputRef.current?.value?.trim()?.length) {
			const value = inputRef.current?.value;
			inputRef.current.value = '';

			inputRef.current.focus();
			await onSendMessage(user?.ai as string, 'text', value);
		}
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleClick();
		}
	};
	return (
		<div className='flex gap-2 h-20 items-stretch mb-3 '>
			<div
				tabIndex={0}
				role='textbox'
				aria-label='Type a message'
				aria-required='true'
				className='basis-[95%] flex py-1 pl-4 bg-dark-grey bg-opacity-70  gap-2 relative transition-colors duration-500 rounded-xl shadow-md border border-transparent focus-visible:border-purple-900 focus-visible:outline-none focus-within:border-purple-900'
			>
				<Input
					ref={inputRef}
					onKeyDown={handleKeydown}
					placeholder='Type a message...'
					aria-label='Type a message'
					aria-required='true'
					className='text-gray-300 self-center text-2xl placeholder:text-gray-400 border-none -ml-3  focus:focus-visible:border-none focus:focus-visible:outline-none focus:focus-visible:ring-0'
				/>
			</div>
			<Button
				type='submit'
				onClick={handleClick}
				title='Send Message'
				aria-label='Send Message'
				role='button'
				className='self-center h-full min-w-20 bg-gradient-dark border border-purple-900 hover:scale-105'
			>
				<PaperPlaneIcon className='h-7 w-6 self-center' />
			</Button>
		</div>
	);
};

export default AIMessageContainer;
