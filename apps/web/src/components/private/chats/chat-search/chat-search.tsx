import Search from '@/components/ui/search';
import useChatSearch from '@/hooks/chat/useChatSearch';
import ChatSearchSuggestions from './search-suggestions';

const ChatSearch = () => {
	const { onSearch, searchResult, loading } = useChatSearch();

	return (
		<Search
			shortcutKey='k'
			onChange={onSearch}
			placeholder='Find/Create Chats...'
			className='flex-1'
			loading={loading}
			renderSuggestions={({ isOpen, setIsOpen }) =>
				!loading && searchResult ? (
					<ChatSearchSuggestions
						suggestions={searchResult!}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
					/>
				) : null
			}
		/>
	);
};

export default ChatSearch;
