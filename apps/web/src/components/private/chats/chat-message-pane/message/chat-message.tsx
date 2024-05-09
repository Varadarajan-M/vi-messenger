import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import { getTimeFromDate } from '@/lib/datetime';
import { cn, getTextAvatar } from '@/lib/utils';
import { User } from '@/types/auth';
import { Chat } from '@/types/chat';
import { Message, MessageReaction } from '@/types/message';
import { useState } from 'react';
import ChatAvatar from '../../chat-listing-pane/chat-avatar';
import { MenuIcon } from '../chat-header';
import DeleteMessageDialog from './delete-message';
import EditMessageDialog from './edit-message';
import { EyeIcon, ReplyIcon } from './icons';
import MessageReactions from './message-reactions';
import MessageReactionDisplay from './reactions-display';
import { MessageRenderer, MessageReplyRenderer } from './renderer';

import placeholderImg from '@/assets/placeholder.webp';
import { getMessageSenderText } from '@/lib/chat';

type MessageProps = {
	showAvatar: boolean;
	showUsername: boolean;
	sender: 'self' | 'other';
	message: Message;
	chat: Chat;
	onDelete: (messageId: string, chatId: string) => void;
	onEdit: (messageId: string, chatId: string, message: string) => void;
	onReact: (messageId: string, reaction: MessageReaction) => void;
	onReply: (replyTo: Message | null) => void;
};

export const MessageOptionMenu = ({
	message,
	chat,
	user,
	onEdit,
	onDelete,
}: Pick<MessageProps, 'message' | 'onEdit' | 'onDelete' | 'chat'> & { user: User }) => {
	const [open, setOpen] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const messageModifierConditions = [
		message?.sender?._id === user?._id,
		new Date(message.createdAt) > new Date(Date.now() - 7 * 60 * 1000),
	];

	const canDeleteMessage = () => messageModifierConditions.every(Boolean);

	const canEditMessage = () =>
		[...messageModifierConditions, message.type === 'text'].every(Boolean);

	const onDialogOpen = () => {
		setIsDialogOpen(true);
	};

	const onDialogClose = (open: boolean) => {
		if (!open) {
			setIsDialogOpen(false);
		}
	};

	const handleDropdownMenu = (open: boolean) => {
		if (!isDialogOpen) return setOpen(open);
		setOpen(true);
	};

	return (
		<DropdownMenu open={open} onOpenChange={handleDropdownMenu}>
			<DropdownMenuTrigger className=' absolute top-2.5 right-0 focus-visible:outline-none h-max w-max self-center px-2 py-1.5 rounded-full data-[state=open]:bg-black data-[state=open]:bg-opacity-20 transition-all'>
				<MenuIcon className='h-4 w-4' />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				// sideOffset={}
				className='mx-5 bg-gradient-dark text-white border-none'
			>
				<EditMessageDialog message={message} onEdit={onEdit} onClose={onDialogClose}>
					<DropdownMenuItem disabled={!canEditMessage()} onClick={onDialogOpen}>
						{' '}
						Edit
					</DropdownMenuItem>
				</EditMessageDialog>
				<DeleteMessageDialog
					message={message}
					chat={chat}
					onDelete={onDelete}
					onClose={onDialogClose}
				>
					<DropdownMenuItem disabled={!canDeleteMessage()} onClick={onDialogOpen}>
						Delete
					</DropdownMenuItem>
				</DeleteMessageDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const MessageReply = ({ message }: Pick<MessageProps, 'message'>) => {
	if (!message?.replyTo?.content) return null;

	const messageSender = getMessageSenderText(message?.replyTo?.sender as any);

	const handleReplyClick = () => {
		const sourceMsg = document.getElementById(message?.replyTo?._id as string)!;
		if (sourceMsg) {
			const messageBubble = sourceMsg?.childNodes?.[1] as HTMLElement;
			Promise.resolve(sourceMsg.scrollIntoView({ behavior: 'smooth', block: 'center' })).then(
				() => {
					messageBubble && messageBubble?.classList.add('highlight');
					setTimeout(() => {
						messageBubble && messageBubble?.classList.remove('highlight');
					}, 3000);
				},
			);
		}
	};

	return (
		<div
			onClick={handleReplyClick}
			className={cn(
				'flex flex-col bg-dark-grey bg-opacity-30 items-start justify-center gap-0.3 mb-1 p-2 h-20 w-full  min-h-20 min-w-full rounded-lg border-l-8 shadow-lg overflow-hidden',
				{
					'border-l-cyan-700': messageSender === 'You',
					'border-l-purple-600': messageSender !== 'You',
				},
			)}
		>
			<p className='text-md font-semibold text-gray-400'>{messageSender}</p>
			<MessageReplyRenderer
				type={message?.replyTo?.type}
				content={message?.replyTo?.content}
			/>
		</div>
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
	onReact,
	onReply,
}: MessageProps) => {
	const { user } = useAuthInfo();
	const isMediumScreen = useMediaQuery('( max-width: 1024px )');
	const isSmallScreen = useMediaQuery('( max-width: 400px )');

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
			'dark-b relative rounded-2xl pt-3 pr-3 pb-2 pl-3.5 flex flex-col min-w-28 max-w-[70%] break-all',
			{
				'message-bubble message-bubble__other rounded-bl-none':
					showAvatar && sender === 'other',
				'message-bubble message-bubble__self rounded-br-none':
					showAvatar && sender === 'self',
				'p-[10px]': !showAvatar && !showUsername,
				'order-2': sender === 'self',
			},
		),
		avatar: cn('self-end', {
			'order-3 ml-2': sender === 'self',
			'mr-3': sender === 'other' && !isMediumScreen,
			'min-w-12': !isSmallScreen,
			hidden: isSmallScreen,
		}),
		msgContainer: cn('relative flex max-w-[75%] items-center group w-full', {
			'self-start justify-start': sender === 'other',
			'self-end justify-end': sender === 'self',
			'max-w-full': isMediumScreen,
		}),
		reactionBtn: cn(
			'bg-gray-500  bg-opacity-30 p-1.5 mx-1 rounded-full transition-all cursor-pointer',
			{
				'order-1': sender === 'self',
			},
		),

		replyBtn: cn(
			'bg-gray-500  bg-opacity-30 p-1.5 mx-1 rounded-full hover:scale-125 transition-all cursor-pointer',
			{
				'order-0': sender === 'self',
			},
		),
	};

	return (
		<div className={classes.msgContainer} id={message?._id}>
			<div className={classes.avatar}>
				{showAvatar && (
					<ChatAvatar
						img={
							message?.sender?.picture ??
							getTextAvatar(message?.sender?.username ?? message?.sender?.email) ??
							placeholderImg
						}
						variant='block'
						size={isMediumScreen ? 'sm' : 'md'}
					/>
				)}
			</div>
			<div className={classes.msgBubble}>
				{sender === 'self' && (
					<MessageOptionMenu
						message={message}
						user={user as User}
						chat={chat}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				)}
				{(showUsername || (isSmallScreen && sender === 'other')) && (
					<p className='text-md font-semibold text-gray-400 capitalize'>
						{message?.sender?.username ?? 'User'}
					</p>
				)}

				<MessageReply message={message} />

				<MessageRenderer type={message?.type} content={message?.content} />

				<div className='flex items-center justify-between'>
					<p className='ml-auto text-gray-500 text-xs relative z-5 flex gap-1 items-center'>
						<time>{getTimeFromDate(message?.createdAt)}</time>
						{getSeenStatus() && (
							<span>
								<EyeIcon />
							</span>
						)}
					</p>
				</div>

				<MessageReactionDisplay message={message} />
			</div>

			<MessageReactions
				sender={sender}
				message={message}
				onReact={onReact}
				className={classes.reactionBtn}
			/>
			<ReplyIcon onClick={() => onReply(message)} className={classes.replyBtn} />
		</div>
	);
};

export default Message;
