import { getTimeFromDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Message } from '@/types/message';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { memo, useState } from 'react';
import MarkdownRenderer from './markdown-renderer';

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
					className='text-white flex items-center gap-1 text-xs hover:text-lime-300 py-1.5 px-4 bg-gray-900 cursor-pointer rounded-md -mt-1'
					onClick={onCopy}
				>
					<span>{text}</span>
					{text === 'Copy' ? (
						<CopyIcon className='w-3 h-3' />
					) : (
						<CheckIcon className='w-4 h-4' />
					)}
				</span>
			</div>

			<MarkdownRenderer
				content={
					typeof message?.content === 'string'
						? message?.content
						: 'Error while streaming message, this should automatically reload, if not please refresh the page.'
				}
			/>

			<time className='text-xs text-gray-500 font-medium ml-auto'>
				{getTimeFromDate(message?.createdAt)}
			</time>
		</div>
	);
};

const Stream = ({ message, loading }: { message: string; loading: boolean }) => {
	if (!loading && !message) {
		return null;
	}

	return (
		<div
			className={cn(
				'dark-b relative rounded-2xl pt-3 pr-3 pb-2 pl-3.5 flex flex-col min-w-28 max-w-[90%] md:max-w-[60%] break-words self-start',
			)}
		>
			<div className='flex justify-between items-center gap-2 my-2'>
				<span className='text-sm self-start w-max text-purple-300 font-medium mb-1 hover:text-lime-300 cursor-pointer'>
					VIM AI✨
				</span>
			</div>

			{loading ? (
				<div className='text-white animate-pulse mb-3 text-md'>AI is thinking...💭</div>
			) : (
				<MarkdownRenderer content={message} />
			)}
		</div>
	);
};

export const StreamedMessage = memo(Stream);

export default memo(AIChatMessage);
