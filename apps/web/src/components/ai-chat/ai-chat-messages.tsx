import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useActiveChat from '@/hooks/chat/useActiveChat';
import useDebouncedValue from '@/hooks/common/useDebounceValue';
import useFetchMessages from '@/hooks/messages/useFetchMessages';
import { useMessageStore } from '@/zustand/store';
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
	ScrollToBottom,
	ShowPreviousMessages,
	PreviousMessageLoader,
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

	const handleScrollToBottom = useCallback(() => {
		const container = document.getElementById('scrollable-messages-container')! as any;
		const lastElement = container?.lastChild?.lastChild;
		lastElement?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	return (
		<>
			{loading && messages.length > 0 && <PreviousMessageLoader />}
			{canShowPreviousMessages && (
				<ShowPreviousMessages onClick={handleShowPreviousMessages} />
			)}
			{loading && messages.length === 0 && <InitialMessageLoader />}
			{!loading && messages.length === 0 && <EmptyMessagePanel />}
			{messages?.map((message, i) => (
				<AIChatMessage
					key={message?._id ?? `message-${i}`}
					message={message}
					sender={getSender(message?.sender?._id)}
				/>
			))}
			{!loading && messages.length > 0 && <ScrollToBottom onClick={handleScrollToBottom} />}
		</>
	);
});

const AiChatMessages = forwardRef(
	({ streamingMessage, loading }: { streamingMessage: string | null; loading: boolean }, ref) => {
		const lastMessageRef = useRef<HTMLDivElement>(null);

		const debouncedStream = useDebouncedValue(streamingMessage?.toString() || '', 100);

		const isInitial = useRef(true);

		const messages = useMessageStore((state) => state.messages);

		const container = document.getElementById('scrollable-messages-container')! as any;

		useEffect(() => {
			if (debouncedStream?.toString()?.length > 0) {
				lastMessageRef?.current?.scrollIntoView({ behavior: 'instant' });
			}
		}, [debouncedStream]);

		useEffect(() => {
			if (messages.length > 0 && isInitial.current && container?.scrollHeight > 0) {
				container && (container.scrollTop = container.scrollHeight);
				isInitial.current = false;
			}
		}, [container, messages]);

		useEffect(() => {
			if (messages.length > 0 && !isInitial.current && container?.scrollHeight > 0) {
				container && (container.scrollTop = container.scrollHeight);
			}
		}, [container, messages]);

		useImperativeHandle(ref, () => ({
			scrollIntoView: () => {
				lastMessageRef?.current?.scrollIntoView({ behavior: 'instant' });
			},
		}));
		return (
			<div className='flex flex-col gap-8 h-full py-16'>
				<MessagesSection />

				<StreamedMessage message={debouncedStream as string} loading={loading} />

				<div ref={lastMessageRef} className='min-h-6 min-w-full ' />
			</div>
		);
	},
);

export default AiChatMessages;
