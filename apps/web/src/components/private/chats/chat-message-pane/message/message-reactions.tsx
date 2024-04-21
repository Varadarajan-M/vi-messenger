import { REACTIONS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Message, MessageReaction } from '@/types/message';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import { useState } from 'react';
import { EmojiIcon } from '../chat-input';

const MessageReactions = ({
	message,
	className,
	onReact,
}: {
	message: Message;
	className?: string;
	onReact: (messageId: string, reaction: MessageReaction) => void;
}) => {
	const [open, setOpen] = useState(false);

	const classes = cn('relative', className);

	const onReactionClick = (reaction: any) => {
		setOpen(!open);
		onReact(
			message?._id,
			REACTIONS?.[reaction?.imageUrl as keyof typeof REACTIONS] as MessageReaction,
		);
	};

	return (
		<div className={classes} onMouseLeave={() => setOpen(false)}>
			<EmojiIcon onClick={() => setOpen(!open)} />
			{(
				<EmojiPicker
					theme={Theme.DARK}
					emojiStyle={EmojiStyle.NATIVE}
					style={{
						position: 'absolute',
						left: '50%',
						top: '100%',
						marginTop: '0.5rem',
						zIndex: 99999999,
						transform: 'translateX(-50%)',
						maxWidth: '80vw',
						overflowX: 'auto',
						display: open ? '' : 'none',
					}}
					reactionsDefaultOpen
					lazyLoadEmojis
					open={open}
					allowExpandReactions={false}
					onReactionClick={onReactionClick}
				/>
			)}
		</div>
	);
};

export default MessageReactions;
