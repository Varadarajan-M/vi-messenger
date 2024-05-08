import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { REACTION_NAME_MAP } from '@/lib/data';
import { Message, MessageReaction } from '@/types/message';
import { useMemo } from 'react';

import useFetchReactions from '@/hooks/messages/useFetchReactions';
import { getTextAvatar } from '@/lib/utils';
import ChatAvatar from '../../chat-listing-pane/chat-avatar';

import placeholderImg from '@/assets/placeholder.webp';

const getMessageReactions = (message: Message) => {
	let totalCount = 0;
	const emojis: string[] = [];
	Object.keys(message?.reactions ?? {}).forEach((key: string) => {
		const reactionCount = message?.reactions?.[key as MessageReaction]?.length || 0;
		totalCount += reactionCount;
		reactionCount > 0 && emojis.push(REACTION_NAME_MAP[key as MessageReaction]);
	});

	return {
		totalCount,
		emojis,
	};
};

const EmojiDisplay = ({
	messageReactions,
}: {
	messageReactions: ReturnType<typeof getMessageReactions>;
}) => {
	return (
		<div className='inline-flex items-center absolute top-full -mt-1 left-0 -ml-1 gap-0.5 w-fit border border-gray-600 dark-b rounded-3xl p-1 px-3 justify-self-end'>
			{messageReactions?.emojis?.slice(0, 3).map((emoji) => (
				<span
					className='text-xl transition-all duration-300 hover:animate-shake'
					key={emoji}
				>
					{emoji}
				</span>
			))}
			{(messageReactions?.totalCount ?? 0) > 0 && (
				<span className='text-gray-400 text-xs mt-0.5 font-semibold ml-1'>
					{messageReactions?.totalCount}
				</span>
			)}
		</div>
	);
};

const MessageReactionDisplay = ({ message }: { message: Message }) => {
	const messageReactions = useMemo(() => getMessageReactions(message), [message]);
	const { fetchReactions, reactions, loading } = useFetchReactions();

	if (messageReactions?.totalCount <= 0) return null;

	return (
		<Dialog onOpenChange={(shouldFetch) => fetchReactions(shouldFetch, message)}>
			<DialogTrigger asChild>
				<div className='cursor-pointer relative'>
					<EmojiDisplay messageReactions={messageReactions} />
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md rounded-sm w-[30vw] min-w-[300px] bg-black text-white border-white max-h-[70vh]  overflow-y-auto flex flex-col'>
				<DialogHeader>
					<DialogTitle className='text-center'>
						Reactions({messageReactions?.totalCount})
					</DialogTitle>
				</DialogHeader>
				{reactions &&
					!loading &&
					Object.entries(reactions).map(([key, value], i) =>
						value?.map((user) => (
							<div className='flex justify-between items-center' key={i}>
								<div className='flex gap-4 items-center'>
									<ChatAvatar
										img={
											user?.picture ??
											getTextAvatar(user?.username) ??
											placeholderImg
										}
										variant='block'
										size='md'
									/>
									<p className='text-gray-300 text-opacity-90 font-medium capitalize ellipsis-1;'>
										{user?.username}
									</p>
								</div>
								<span className='text-3xl font-bold'>
									{REACTION_NAME_MAP[key as MessageReaction]}
								</span>
							</div>
						)),
					)}
				{loading && (
					<p className='text-center text-gray-300 text-opacity-90 animate-pulse'>
						Loading reactions...
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default MessageReactionDisplay;
