import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useSendMessageToAI from '@/hooks/messages/useSendMessageToAI';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import { cn } from '@/lib/utils';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Children, useRef, useState } from 'react';
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
	const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const handleStreaming = (message: string) => {
		setLoading(false);
		setStreamingMessage((prev) => (prev ? `${prev + message}` : message));
	};

	const handleStreamEnd = () => {
		setStreamingMessage(null);
	};

	const handleSendMessage = () => {
		setLoading(true);
	};

	return (
		<ContainerLayout>
			<AiChatMessages streamingMessage={streamingMessage} loading={loading} />
			<AIMessageInput
				onMessageStream={handleStreaming}
				onStreamEnd={handleStreamEnd}
				onSendMessage={handleSendMessage}
			/>
		</ContainerLayout>
	);
};

const AIMessageInput = ({
	onMessageStream,
	onStreamEnd,
	onSendMessage: onSendMessageCb,
}: {
	onMessageStream: any;
	onStreamEnd: any;
	onSendMessage?: any;
}) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { onSendMessage } = useSendMessageToAI();
	const { user } = useAuthInfo();
	const [height, setHeight] = useState(65);
    const isSmallScreen = useMediaQuery('( max-width: 900px )');

	const handleClick = async () => {
		if (inputRef.current?.value?.trim()?.length) {
			const value = inputRef.current?.value;
			await onSendMessageCb?.();
			inputRef.current.value = '';
			setHeight(65);
			inputRef.current.focus();
			await onSendMessage(
				user?.ai as string,
				'text',
				value,
				onMessageStream,
				console.log,
				onStreamEnd,
			);
		}
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (isSmallScreen && e.key === 'Enter') {
					setHeight((h) => (h < 140 ? h + 10 : 140));
					return;
		}
		
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleClick();
		}

		if (e.key === 'Enter' && e.shiftKey) {
			setHeight((h) => (h < 140 ? h + 10 : 140));
		}
	};
	return (
		<div className='flex gap-2 h-max items-stretch mb-3 relative'>
			<div
				tabIndex={0}
				role='textbox'
				aria-label='Type a message'
				aria-required='true'
				className='w-full flex py-1 pl-4 pr-16 bg-dark-grey bg-opacity-70  gap-2 relative transition-colors duration-500 rounded-2xl shadow-md border border-transparent focus-visible:border-purple-900 focus-visible:outline-none focus-within:border-purple-950'
			>
				<textarea
					ref={inputRef}
					onKeyDown={handleKeydown}
					placeholder='💬 Ask me anything ✨ #Markdown is supported here!🚀'
					aria-label='Type a message'
					aria-required='true'
					className='text-sm pt-2 pb-3 text-gray-300 self-center md:text-lg placeholder:opacity-70 bg-transparent w-full resize-none border-none -ml-1  focus:focus-visible:border-none focus:focus-visible:outline-none focus:focus-visible:ring-0 placeholder:mt-3'
					style={{ height: height }}
				/>
				<span
					title='Send Message'
					onClick={handleClick}
					className={cn(
						'ml-auto absolute bottom-3 right-5 bg-black border-[2px] grid place-content-center rounded-full hover:border-purple-950 border-gray-800 w-[42px] h-[42px]  transition-all duration-300 text-white cursor-pointer hover:scale-125',
					)}
				>
					<PaperPlaneIcon className='w-4 h-4' />
				</span>
			</div>
		</div>
	);
};

export default AIMessageContainer;
