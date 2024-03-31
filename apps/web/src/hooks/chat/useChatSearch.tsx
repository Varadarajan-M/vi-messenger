import { useCallback, useEffect, useState } from 'react';

import { searchChats } from '@/api/chat';

import { User } from '@/types/auth';
import { Chat } from '@/types/chat';

import useDebouncedValue from '../common/useDebounceValue';

type SearchResult = {
	users: User[];
	groups: Chat[];
};

const useChatSearch = () => {
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
	const [loading, setLoading] = useState(false);

	const debouncedSearchTerm = useDebouncedValue(searchTerm, 700);

	useEffect(() => {
		const _search = async () => {
			try {
				setLoading(true);
				const res = (await searchChats(debouncedSearchTerm as string)) as any;
				setSearchResult(res);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		if (debouncedSearchTerm?.toString()?.trim().length) {
			_search();
		}
	}, [debouncedSearchTerm]);

	const onSearch = useCallback(async (query: string) => {
		if (!query.trim().length) {
			setSearchTerm('');
			return;
		}
		setSearchTerm(query);
	}, []);

	return {
		searchTerm,
		searchResult,
		loading,
		onSearch,
	};
};

export default useChatSearch;
