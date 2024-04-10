import useAuthInfo from '@/hooks/auth/useAuthInfo';
import { getTimeFromDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { Message } from '@/types/message';
import ChatAvatar from '../chat-listing-pane/chat-avatar';

type MessageProps = {
	showAvatar: boolean;
	showUsername: boolean;
	sender: 'self' | 'other';
	message: Message;
	chat: Chat;
};

const EyeIcon = () => {
	return (
		<svg
			width='15'
			height='15'
			viewBox='0 0 15 15'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z'
				fill='grey'
				fillRule='evenodd'
				clipRule='evenodd'
			></path>
		</svg>
	);
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
				<p className='text-sm font-medium text-white'>{message?.content ?? ''}</p>
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
