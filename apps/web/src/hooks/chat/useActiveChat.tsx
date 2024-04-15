import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useActiveChat = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const chat = searchParams.get('chat') ?? '';

	const setChat = useCallback(
		(value: string) => {
			searchParams.set('chat', value);
			setSearchParams(searchParams.toString());
		},
		[searchParams, setSearchParams],
	);

	const resetChat = useCallback(() => {
		searchParams.delete('chat');
		setSearchParams(searchParams.toString());
	}, [searchParams, setSearchParams]);

	return { chat, setSearchParams, setChat, resetChat };
};

export default useActiveChat;
