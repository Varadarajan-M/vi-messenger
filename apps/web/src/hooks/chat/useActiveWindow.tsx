import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useActiveWindow = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const activeWindow = searchParams.get('window') ?? 'all-chats';

	const reset = useCallback(() => {
		searchParams.delete('window');
		setSearchParams(searchParams.toString());
	}, [searchParams, setSearchParams]);

	const setActiveWindow = useCallback(
		(value: string) => {
			searchParams.set('window', value);
			setSearchParams(searchParams.toString());
		},
		[searchParams, setSearchParams],
	);

	return { activeWindow, setActiveWindow, reset };
};

export default useActiveWindow;
