import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import { getTimeFromDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { Message } from '@/types/message';
import { ComponentPropsWithoutRef } from 'react';
import { useForm } from 'react-hook-form';
import ChatAvatar from '../../chat-listing-pane/chat-avatar';
import { EyeIcon } from './icons';
import { MessageRenderer } from './renderer';

type MessageProps = {
	showAvatar: boolean;
	showUsername: boolean;
	sender: 'self' | 'other';
	message: Message;
	chat: Chat;
	onDelete: (messageId: string, chatId: string) => void;
	onEdit: (messageId: string, chatId: string, message: string) => void;
};

const EditIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
	<svg
		width='15'
		height='15'
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path
			d='M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z'
			fill='lightgray'
			fillRule='evenodd'
			clipRule='evenodd'
		></path>
	</svg>
);

const DeleteIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
	<svg
		width='15'
		height='15'
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		{...props}
	>
		<path
			d='M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z'
			fill='red'
			fillRule='evenodd'
			clipRule='evenodd'
		></path>
	</svg>
);

const DeleteMessageDialog = ({
	message,
	chat,
	onDelete,
}: {
	message: Message;
	chat: Chat;
	onDelete: (messageId: string, chatId: string) => void;
}) => {
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<DeleteIcon className='relative rounded-full z-10 h-3.5 w-3.5 cursor-pointer' />
				</DialogTrigger>
				<DialogContent className='sm:max-w-md rounded-sm w-[30vw] min-w-[300px] bg-black text-white border-white  overflow-y-auto flex flex-col'>
					<DialogHeader>
						<DialogTitle className='text-center'>Are you sure?</DialogTitle>
					</DialogHeader>
					<DialogFooter className='flex sm:justify-center gap-2'>
						<DialogClose asChild>
							<Button
								type='button'
								variant='secondary'
								className='bg-dark-grey text-white hover:bg-gray-700'
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type='submit'
							variant={'destructive'}
							onClick={() => onDelete(message._id, chat?._id as string)}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

const EditMessageDialog = ({
	message,
	onEdit,
}: {
	message: Message;
	onEdit: (messageId: string, chatId: string, message: string) => void;
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			message: message?.content as string,
		},
	});

	const onSubmit = (data: { message: string }) => {
		onEdit(message?._id, message?.chatId, data?.message?.trimStart());
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<EditIcon className='relative rounded-full z-10 h-3.5 w-3.5 cursor-pointer' />
			</DialogTrigger>
			<DialogContent className='sm:max-w-md rounded-sm w-[30vw] min-w-[300px] bg-black text-white border-white  overflow-y-auto flex flex-col'>
				<DialogHeader>
					<DialogTitle className='text-center'>Edit message</DialogTitle>
				</DialogHeader>
				<form className='flex-1 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-3 flex-1'>
						<div>
							<Label htmlFor='link' className='sr-only'>
								Update Message
							</Label>
							<Input
								placeholder='Type a message...'
								className='border border-purple-950 focus-within:border-blue-300 h-10'
								{...register('message', { required: "Message can't be empty" })}
							/>
							{errors?.message && (
								<p className='text-red-500 mt-1 text-xs'>
									{errors.message?.message as string}
								</p>
							)}
						</div>

						<DialogFooter className='justify-end'>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									className='bg-dark-grey text-white hover:bg-gray-700'
								>
									Close
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button type='submit' variant={'secondary'}>
									Save
								</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const Message = ({
	showAvatar,
	showUsername,
	sender,
	message,
	chat,
	onDelete,
	onEdit,
}: MessageProps) => {
	const { user } = useAuthInfo();
	const isMediumScreen = useMediaQuery('( max-width: 1024px )');

	const getSeenStatus = () => {
		// to only show seen status to the sender of the message
		if (!(user?._id === message?.sender?._id)) return null;

		// check seen status for groups
		if (chat?.admin) {
			return chat.members?.length === message?.seenBy?.length;
		}

		// check seen status for private chats
		if (!chat?.admin) {
			return message?.seenBy?.length === 2;
		}
	};

	const classes = {
		msgBubble: cn(
			'relative bg-dark-grey rounded-2xl pt-3 pr-3 pb-2 pl-3.5 flex flex-col gap-0.5 min-w-36 group',
			{
				'message-bubble message-bubble__other rounded-bl-none':
					showAvatar && sender === 'other',
				'message-bubble message-bubble__self rounded-br-none':
					showAvatar && sender === 'self',
				'p-[10px]': !showAvatar && !showUsername,
			},
		),
		avatar: cn('self-end min-w-12', {
			'order-2': sender === 'self',
		}),
		msgContainer: cn('flex gap-3.5 max-w-[50%] items-center ', {
			'self-start': sender === 'other',
			'self-end': sender === 'self',
			'max-w-full': isMediumScreen,
		}),
	};

	const canDeleteMessage = () => {
		const conditions = [
			message?.sender?._id === user?._id,
			sender === 'self',
			new Date(message.createdAt) > new Date(Date.now() - 7 * 60 * 1000),
		];
		return conditions.every(Boolean);
	};

	const canEditMessage = () => {
		const conditions = [
			message?.sender?._id === user?._id,
			sender === 'self',
			new Date(message.createdAt) > new Date(Date.now() - 7 * 60 * 1000),
			message.type === 'text',
		];
		return conditions.every(Boolean);
	};

	return (
		<div className={classes.msgContainer} id={message?._id}>
			<div className={classes.avatar}>
				{showAvatar && (
					<ChatAvatar
						img={`https://i.pravatar.cc/300?u=${message?.sender?._id}`}
						variant='block'
						size='sm'
					/>
				)}
			</div>
			<div className={classes.msgBubble}>
				{showUsername && (
					<p className='text-md font-semibold text-gray-400 capitalize'>
						{message?.sender?.username ?? 'User'}
					</p>
				)}

				<MessageRenderer type={message?.type} content={message?.content} />

				<div className='flex items-center justify-between'>
					<p className='text-gray-500 text-xs relative z-5 flex gap-1 items-center'>
						<time>{getTimeFromDate(message?.createdAt)}</time>
						{getSeenStatus() && (
							<span>
								<EyeIcon />
							</span>
						)}
					</p>
					{sender === 'self' && (
						<div className='flex gap-2'>
							{canEditMessage() && (
								<EditMessageDialog message={message} onEdit={onEdit} />
							)}
							{canDeleteMessage() && (
								<DeleteMessageDialog
									message={message}
									chat={chat}
									onDelete={onDelete}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Message;
