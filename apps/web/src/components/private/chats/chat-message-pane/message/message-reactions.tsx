import useAuthInfo from '@/hooks/auth/useAuthInfo';
import { REACTIONS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Message, MessageReaction } from '@/types/message';
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
	const { user } = useAuthInfo();

	const classes = cn('relative', className);

	const onReactionClick = (reaction: MessageReaction) => {
		onReact(message?._id, reaction);
		setOpen(false);
	};

	const hasReacted = (reaction: MessageReaction) =>
		new Set(message?.reactions?.[reaction] ?? []).has(user?._id as string);

	const renderReactionPicker = () => {
		return (
			<div className='absolute left-0 md:translate-x-[-50%] max-w-[300px] md:max-w-[500px] top-full md:left-[50%] z-[10] overflow-x-auto flex gap-3 items-center p-3 rounded-3xl bg-black'>
				{REACTIONS.map((emoji) => (
					<span
						className={cn(
							`relative animate-pulse cursor-pointer hover:scale-[1.6] transition-all text-xl tablet:text-2xl font-bold hover:animate-none`,
							{
								'bg-white bg-opacity-20 p-1 rounded-full': hasReacted(
									emoji.value as MessageReaction,
								),
							},
						)}
						key={emoji.value}
						onClick={() => onReactionClick(emoji.value as MessageReaction)}
					>
						{emoji.label}
					</span>
				))}
			</div>
		);
	};

	return (
		<div className={classes}>
			<EmojiIcon onClick={() => setOpen(!open)} />
			{open && renderReactionPicker()}
		</div>
	);
};

export default MessageReactions;
