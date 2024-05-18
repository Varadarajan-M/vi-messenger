import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import { useCallback, useState } from 'react';
import {
	EmptyMessagePanel,
	InitialMessageLoader,
	ShowPreviousMessages,
} from '../private/chats/chat-message-pane/chat-message-container';
import AIChatMessage from './ai-chat-message';

const AiChatMessages = () => {
	const { chat: chatId } = useActiveChat();
	const { user } = useAuthInfo();
	const [page, setPage] = useState(1);
	const skip = (page - 1) * 10;
	const limit = 10;
	const { messages, loading, totalCount } = useFetchMessages(chatId as string, skip, limit);
	const getSender = (senderId: string) => (user?._id === senderId ? 'user' : 'ai');
	const canShowPreviousMessages =
		!loading &&
		skip < totalCount &&
		totalCount !== 0 &&
		totalCount > limit &&
		totalCount !== messages.length;

	const handleShowPreviousMessages = useCallback(() => {
		if (skip < totalCount) setPage((p) => p + 1);
	}, [skip, totalCount]);

	return (
		<div className='flex flex-col gap-8 h-full py-16'>
			{canShowPreviousMessages && (
				<ShowPreviousMessages onClick={handleShowPreviousMessages} />
			)}
			{loading && messages.length === 0 && <InitialMessageLoader />}
			{!loading && messages.length === 0 && <EmptyMessagePanel />}
			{messages?.map((message) => (
				<AIChatMessage
					key={message._id}
					message={message}
					sender={getSender(message?.sender?._id)}
				/>
			))}
		</div>
	);
};

export default AiChatMessages;
