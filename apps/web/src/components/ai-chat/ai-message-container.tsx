import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Children } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ContainerLayout = ({ children }: { children: React.ReactNode }) => {
	const [messages, input] = Children.toArray(children);
	return (
		<>
			<section className='flex-1 bg-gradient-dark w-full rounded-lg relative overflow-y-hidden overflow-x-hidden  pb-2'>
				<div
					className='p-4 max-h-[90%] h-[80%] overflow-y-auto'
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
			<p className='text-white text-center'>conversation messages</p>
			<AIMessageInput />
		</ContainerLayout>
	);
};

const AIMessageInput = () => {
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
					placeholder='Type a message...'
					aria-label='Type a message'
					aria-required='true'
					className='text-gray-300 self-center text-2xl placeholder:text-gray-400 border-none -ml-3  focus:focus-visible:border-none focus:focus-visible:outline-none focus:focus-visible:ring-0'
				/>
			</div>
			<Button
				type='submit'
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
