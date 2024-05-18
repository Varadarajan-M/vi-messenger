import { getTimeFromDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Message } from '@/types/message';
import MarkdownRenderer from './markdown-renderer';
import { useState } from 'react';

const AIChatMessage = ({ sender, message }: { sender: string; message: Message }) => {
	const [text, setText] = useState('Copy');
	const onCopy = () => {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(
					typeof message.content === 'string'
						? message.content
						: 'Message cannot be copied',
				)
				.then(() => {
					setText('Copied!');
					setTimeout(() => {
						setText('Copy');
					}, 2000);
				})
				.catch(() => {
					alert('Failed to copy!');
				});
		}
	};

	return (
		<div
			className={cn(
				'dark-b relative rounded-2xl pt-3 pr-3 pb-2 pl-3.5 flex flex-col min-w-28 max-w-[90%] md:max-w-[60%] break-all',
				{
					'self-end': sender === 'user',
					'self-start': sender === 'ai',
				},
			)}
		>
			<div className='flex justify-between items-center gap-2 my-2'>
				<span className='text-sm self-start w-max text-purple-300 font-medium mb-1 hover:text-lime-300 cursor-pointer'>
					{sender === 'user' ? 'You🤹🏻' : 'VIM AI✨'}
				</span>
				<span
					className='text-white text-xs hover:text-lime-300 py-1.5 px-4 bg-gray-900 cursor-pointer rounded-md -mt-1'
					onClick={onCopy}
				>
					{text}
				</span>
			</div>

			<MarkdownRenderer
				content={typeof message.content === 'string' ? message.content : 'Media'}
			/>
			<time className='text-xs text-gray-500 font-medium ml-auto'>
				{getTimeFromDate(message?.createdAt)}
			</time>
		</div>
	);
};

export default AIChatMessage;
