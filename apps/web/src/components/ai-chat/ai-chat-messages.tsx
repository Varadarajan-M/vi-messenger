import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useDebouncedValue from '@/hooks/common/useDebounceValue';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import {
	EmptyMessagePanel,
	InitialMessageLoader,
	ShowPreviousMessages,
} from '../private/chats/chat-message-pane/chat-message-container';
import AIChatMessage, { StreamedMessage } from './ai-chat-message';

const MessagesSection = memo(() => {
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
		<>
			{canShowPreviousMessages && (
				<ShowPreviousMessages onClick={handleShowPreviousMessages} />
			)}
			{loading && messages.length === 0 && <InitialMessageLoader />}
			{!loading && messages.length === 0 && <EmptyMessagePanel />}
			{messages?.map((message) => (
				<AIChatMessage
					key={message?._id}
					message={message}
					sender={getSender(message?.sender?._id)}
				/>
			))}
		</>
	);
});

const AiChatMessages = forwardRef(
	({ streamingMessage }: { streamingMessage: string | null }, ref) => {
		const lastMessageRef = useRef<HTMLDivElement>(null);

		const debouncedStream = useDebouncedValue(streamingMessage?.toString() || '', 100);

		useEffect(() => {
			if (debouncedStream !== null) {
				console.log('scrolling');
				lastMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}, [debouncedStream]);

		useImperativeHandle(ref, () => ({
			scrollIntoView: () => {
				lastMessageRef?.current?.scrollIntoView({ behavior: 'instant' });
			},
		}));
		return (
			<div className='flex flex-col gap-8 h-full py-16'>
				<MessagesSection />
				{streamingMessage !== null && <StreamedMessage message={streamingMessage} />}
				<div ref={lastMessageRef} className=' min-h-2 min-w-full' />
			</div>
		);
	},
);

export default AiChatMessages;
