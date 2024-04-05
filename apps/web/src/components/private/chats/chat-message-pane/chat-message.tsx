import { getTimeFromDate } from '@/lib/datetime';
import { cn } from '@/lib/utils';
import { Message } from '@/types/message';
import ChatAvatar from '../chat-listing-pane/chat-avatar';

type MessageProps = {
	showAvatar: boolean;
	showUsername: boolean;
	sender: 'self' | 'other';
	message: Message;
};

const Message = ({ showAvatar, showUsername, sender, message }: MessageProps) => {
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
		<div className={classes.msgContainer}>
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
				<p className='text-gray-500 text-xs self-end relative z-5'>
					<time>{getTimeFromDate(message?.createdAt)}</time>
				</p>
			</div>
		</div>
	);
};

export default Message;
