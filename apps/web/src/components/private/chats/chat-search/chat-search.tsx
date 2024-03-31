import { useState } from 'react';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import ChatSearchSuggestions from './search-suggestions';

import useChatSearch from '@/hooks/chat/useChatSearch';

const ChatSearch = () => {
	const { onSearch, searchTerm, searchResult, loading } = useChatSearch();
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsSuggestionsOpen(true);
		onSearch(e.target?.value);
	};

	return (
		<div className='relative border-none outline-none'>
			<MagnifyingGlassIcon className='absolute top-[50%] left-3 translate-y-[-50%] text-gray-500' />
			<Input
				value={searchTerm}
				onChange={handleChange}
				placeholder='Find/Create Chats...'
				className='pl-8 focus-visible:ring-transparent border-none text-gray-300 placeholder:text-gray-500 placeholder:tracking-tight py-[1.4rem]  bg-black bg-opacity-80 rounded-xl shadow-sm placeholder:text-sm text-base'
			/>
			{loading ? (
				<Card className='flex flex-col items-center justify-center p-5 absolute top-full left-0 my-1 border-none shadow-xl w-full rounded-lg bg-black bg-opacity-90 outline-none'>
					<Loader size='30px' />
				</Card>
			) : null}
			{!loading && isSuggestionsOpen && (searchResult?.users || searchResult?.groups) ? (
				<ChatSearchSuggestions
					suggestions={searchResult!}
					isOpen={isSuggestionsOpen}
					setIsOpen={setIsSuggestionsOpen}
				/>
			) : null}
		</div>
	);
};

export default ChatSearch;
