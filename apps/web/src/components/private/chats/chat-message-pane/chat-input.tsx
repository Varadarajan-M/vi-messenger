import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Fileuploader from '@/components/ui/fileupload';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/contexts/SocketContext';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import useSendMessage from '@/hooks/messages/useSendMessage';
import {
	ComponentPropsWithoutRef,
	Fragment,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import { Message } from '@/types/message';
import Picker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { MouseDownEvent } from 'emoji-picker-react/dist/config/config';

export const EmojiIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
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
			d='M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82708 7.49972C1.82708 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82708 10.6327 1.82708 7.49972ZM5.03747 9.21395C4.87949 8.98746 4.56782 8.93193 4.34133 9.08991C4.11484 9.24789 4.05931 9.55956 4.21729 9.78605C4.93926 10.8211 6.14033 11.5 7.50004 11.5C8.85974 11.5 10.0608 10.8211 10.7828 9.78605C10.9408 9.55956 10.8852 9.24789 10.6587 9.08991C10.4323 8.93193 10.1206 8.98746 9.9626 9.21395C9.41963 9.99238 8.51907 10.5 7.50004 10.5C6.481 10.5 5.58044 9.99238 5.03747 9.21395ZM5.37503 6.84998C5.85828 6.84998 6.25003 6.45815 6.25003 5.97498C6.25003 5.4918 5.85828 5.09998 5.37503 5.09998C4.89179 5.09998 4.50003 5.4918 4.50003 5.97498C4.50003 6.45815 4.89179 6.84998 5.37503 6.84998ZM10.5 5.97498C10.5 6.45815 10.1083 6.84998 9.62503 6.84998C9.14179 6.84998 8.75003 6.45815 8.75003 5.97498C8.75003 5.4918 9.14179 5.09998 9.62503 5.09998C10.1083 5.09998 10.5 5.4918 10.5 5.97498Z'
			fill='lightgray'
			fillRule='evenodd'
			clipRule='evenodd'
		/>
	</svg>
);

export const PlusIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
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

const AttachmentUpload = ({ chatId }: { chatId: string }) => {
	const { onSendMessage } = useSendMessage();

	const handleFileupload = async (res: any) => {
		const type = res?.resource_type;
		const url: string = res?.secure_url ?? '';
		const downloadableUrl = url.replace('upload/', 'upload/fl_attachment/') ?? '';
		const content = {
			url,
			download: downloadableUrl,
			preview: res?.thumbnail_url ?? '',
		};
		await onSendMessage(chatId, type, content);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				title='Upload'
				className='focus:outline-none data-[state=open]:bg-dark-grey p-2 rounded-full'
			>
				<PlusIcon className='h-6 w-10 self-center ' />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='mx-5 bg-gradient-dark text-white border-none'
				sideOffset={5}
			>
				<Fileuploader onUploadSuccess={handleFileupload} onUploadError={console.log}>
					{({ openWidget }) => (
						<DropdownMenuItem onClick={openWidget}>
							Upload Images/Videos
						</DropdownMenuItem>
					)}
				</Fileuploader>
				<DropdownMenuItem>Upload GIFs</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const EmojiPicker = ({
	onEmojiSelect,
	open,
	setOpen,
}: {
	onEmojiSelect: MouseDownEvent;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const isSmallScreen = useMediaQuery('( max-width: 400px )');
	return (
		<Fragment>
			<EmojiIcon
				className='h-6 w-10 self-center mr-2 relative z-10'
				onClick={() => setOpen(!open)}
			/>
			{open && (
				<Picker
					theme={Theme.DARK}
					open={open}
					style={{
						position: 'absolute',
						right: 0,
						bottom: '80%',
						background: 'black',
						zIndex: 99999999,
						width: isSmallScreen ? window.innerWidth - 50 : 300,
						transform: isSmallScreen ? 'translateX(25%)' : 'translateX(0)',
					}}
					lazyLoadEmojis
					emojiStyle={EmojiStyle.NATIVE}
					onEmojiClick={(data, e) => {
						onEmojiSelect(data, e);
					}}
				/>
			)}
		</Fragment>
	);
};

const ChatInput = ({
	chatId,
	onSendMessage: sendMessageCb,
	replyingTo,
	messageInputRef,
}: {
	chatId: string;
	onSendMessage: (message?: Message) => void;
	replyingTo: Message | null;
	messageInputRef?: any;
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const emittedOnce = useRef(false);
	const { onSendMessage } = useSendMessage();
	const { user } = useAuthInfo();
	const socket = useSocket();
	const [emojiOpen, setEmojiOpen] = useState(false);

	const startTyping = useCallback(() => {
		if (!emittedOnce.current) {
			socket?.emit('type_start', {
				chatId,
				userId: user?._id,
			});
		}
		emittedOnce.current = true;
	}, [chatId, socket, user?._id]);

	const stopTyping = () => {
		socket?.emit('type_end', {
			chatId,
			userId: user?._id,
		});
		emittedOnce.current = false;
	};

	const handleClick = async () => {
		if (inputRef.current?.value?.trim()?.length) {
			const value = inputRef.current?.value;
			inputRef.current.value = '';
			inputRef.current.focus();
			await onSendMessage(chatId, 'text', value, replyingTo, sendMessageCb);
			stopTyping();
			setEmojiOpen(false);
		}
	};

	const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleClick();
		}
	};

	const onEmojiClick = (data: EmojiClickData) => {
		if (inputRef.current) {
			inputRef.current.value += data.emoji;
		}
	};

	useImperativeHandle(messageInputRef, () => {
		return {
			focus: () => {
				inputRef.current?.focus();
			},
		};
	});

	return (
		<div className='flex gap-2 h-16  items-stretch mb-3'>
			<div
				tabIndex={0}
				role='textbox'
				onBlur={stopTyping}
				aria-label='Type a message'
				aria-required='true'
				className='basis-[95%] flex py-1 bg-dark-grey bg-opacity-70  gap-2 relative transition-colors duration-500 rounded-xl shadow-md border border-transparent focus-visible:border-purple-900 focus-visible:outline-none focus-within:border-purple-900'
			>
				<AttachmentUpload chatId={chatId} />

				<Input
					onChange={startTyping}
					onBlur={stopTyping}
					ref={inputRef}
					onKeyDown={handleKeydown}
					placeholder='Type a message...'
					aria-label='Type a message'
					aria-required='true'
					className='text-gray-300 self-center text-2xl placeholder:text-gray-400 border-none basis-[94%] -ml-3 focus:focus-visible:border-none focus:focus-visible:outline-none focus:focus-visible:ring-0'
				/>

				<EmojiPicker open={emojiOpen} setOpen={setEmojiOpen} onEmojiSelect={onEmojiClick} />
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
