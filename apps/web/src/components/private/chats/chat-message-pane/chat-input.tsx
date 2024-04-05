import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSendMessage from '@/hooks/messages/useSendMessage';
import { ComponentPropsWithoutRef, useRef } from 'react';

const PlusIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
	<svg
		width='15'
		height='15'
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		role='button'
		{...props}
	>
		<path
			d='M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z'
			fill='lightgray'
			fillRule='evenodd'
			clipRule='evenodd'
		></path>
	</svg>
);
const SendIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
	<svg
		width='15'
		height='15'
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path
			d='M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z'
			fill='currentColor'
			fillRule='evenodd'
			clipRule='evenodd'
		></path>
	</svg>
);
const ChatInput = ({ chatId }: { chatId: string }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { onSendMessage } = useSendMessage();
	const handleClick = async () => {
		if (inputRef.current?.value?.trim()?.length) {
			const { value } = inputRef.current;
			await onSendMessage(chatId, 'text', value);
			inputRef.current.value = '';
		}
	};

	return (
		<div className='flex gap-2 h-16  items-stretch mb-3'>
			<div
				tabIndex={0}
				role='textbox'
				aria-label='Type a message'
				aria-required='true'
				className='basis-[95%] flex py-1 bg-dark-grey bg-opacity-70  gap-2 relative transition-colors duration-500 rounded-xl shadow-md border border-transparent focus-visible:border-purple-900 focus-visible:outline-none focus-within:border-purple-900'
			>
				<PlusIcon className='h-6 w-10 self-center' />
				<Input
					ref={inputRef}
					placeholder='Type a message...'
					aria-label='Type a message'
					aria-required='true'
					className='text-gray-300 self-center placeholder:text-gray-400 border-none basis-[94%] -ml-3 focus:focus-visible:border-none focus:focus-visible:outline-none focus:focus-visible:ring-0'
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
				<SendIcon className='h-7 w-6 self-center' />
			</Button>
		</div>
	);
};

export default ChatInput;
