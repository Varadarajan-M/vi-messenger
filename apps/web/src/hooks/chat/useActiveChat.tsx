import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuthInfo from '../auth/useAuthInfo';
import useActiveWindow from './useActiveWindow';

const useActiveChat = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const chat = searchParams.get('chat') ?? '';
	const { user } = useAuthInfo();
	const { activeWindow } = useActiveWindow();

	const isAiChatActive = activeWindow === 'ai-chat' && user?.ai === chat;

	const setChat = useCallback(
		(value: string) => {
			searchParams.set('chat', value);
			isAiChatActive && searchParams.set('window', 'all-chats');
			setSearchParams(searchParams.toString());
		},
		[isAiChatActive, searchParams, setSearchParams],
	);

	const resetChat = useCallback(() => {
		isAiChatActive && searchParams.delete('window');
		searchParams.delete('chat');
		setSearchParams(searchParams.toString());
	}, [isAiChatActive, searchParams, setSearchParams]);

	return { chat, setSearchParams, setChat, resetChat };
};

export default useActiveChat;
