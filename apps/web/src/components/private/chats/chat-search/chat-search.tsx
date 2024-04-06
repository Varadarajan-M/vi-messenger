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
			loading={loading}
			renderSuggestions={({ isOpen, setIsOpen }) =>
				!loading ? (
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
