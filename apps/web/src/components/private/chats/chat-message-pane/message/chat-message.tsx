import useAuthInfo from '@/hooks/auth/useAuthInfo';
import { getTimeFromDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { Message } from '@/types/message';
import ChatAvatar from '../../chat-listing-pane/chat-avatar';
import { EyeIcon } from './icons';
import { MessageRenderer } from './renderer';

type MessageProps = {
	showAvatar: boolean;
	showUsername: boolean;
	sender: 'self' | 'other';
	message: Message;
	chat: Chat;
};

const Message = ({ showAvatar, showUsername, sender, message, chat }: MessageProps) => {
	const { user } = useAuthInfo();

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
			'relative bg-dark-grey rounded-3xl pt-3 pr-3  pb-2 pl-3.5  flex flex-col gap-0.5',
			{
				'message-bubble message-bubble__other rounded-bl-none':
					showAvatar && sender === 'other',
				'message-bubble message-bubble__self rounded-br-none':
					showAvatar && sender === 'self',
				'pt-[17px] pr-[11px] pb-[11px] pl-[13px]': !showAvatar && !showUsername,
			},
		),
		avatar: cn('self-end min-w-12', {
			'order-2': sender === 'self',
		}),
		msgContainer: cn('flex gap-3.5 max-w-[50%] items-center', {
			'self-start': sender === 'other',
			'self-end': sender === 'self',
		}),
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
					<p className='text-sm font-semibold text-gray-400 capitalize'>
						{message?.sender?.username ?? 'User'}
					</p>
				)}
				<MessageRenderer type={message?.type} content={message?.content} />
				<p className='text-gray-500 text-xs self-end relative z-5 flex gap-1 items-center'>
					<time>{getTimeFromDate(message?.createdAt)}</time>
					{getSeenStatus() && (
						<span>
							<EyeIcon />
						</span>
					)}
				</p>
			</div>
		</div>
	);
};

export default Message;
