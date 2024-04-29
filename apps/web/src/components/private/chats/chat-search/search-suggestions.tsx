import { Card } from '@/components/ui/card';
import useCreateOrFetchChat from '@/hooks/chat/useCreateOrFetchChat';
import useSetAndPopulateActiveChat from '@/hooks/chat/useSetAndPopulateActiveChat';
import { User } from '@/types/auth';
import { Chat } from '@/types/chat';
import { GroupSearchResult, UserSearchResult } from './search-result';

type SearchResult = {
	users: User[];
	groups: Chat[];
};
const ChatSearchSuggestions = ({
	suggestions,
	isOpen,
	setIsOpen,
}: {
	suggestions: SearchResult;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { createOrFetchDm } = useCreateOrFetchChat();
	const setOrCreateActiveChat = useSetAndPopulateActiveChat();

	if (!isOpen) return null;

	const renderNotFound = (message: string) => (
		<p className='m-0 mt-1 text-gray-300 rounded-lg bg-transparent underline text-opacity-90 font-medium w-full h-6 '>
			{message}
		</p>
	);

	return (
		<Card className='flex flex-col absolute top-full left-0 my-1 border-none shadow-xl w-max min-w-full max-w-80 rounded-lg bg-black outline-none max-h-[50vh] min-h-40 overflow-auto'>
			<div className='p-5'>
				<h5 className='text-gray-400 font-semibold text-sm mb-3'>Users</h5>
				<ul className='flex flex-col gap-3'>
					{suggestions?.users?.length > 0
						? suggestions?.users?.map((item) => (
								<li key={item._id}>
									<UserSearchResult
										item={item}
										onClick={() => {
											createOrFetchDm(item?._id);
											setIsOpen(false);
										}}
									/>
								</li>
						))
						: renderNotFound('No users found!')}
				</ul>
			</div>
			<div className='p-5'>
				<h5 className='text-gray-400 font-semibold text-sm mb-3'>Groups</h5>
				<ul className='flex flex-col gap-3'>
					{suggestions?.groups?.length > 0
						? suggestions?.groups?.map((item) => (
								<li key={item._id}>
									<GroupSearchResult
										item={item}
										onClick={() => {
											setOrCreateActiveChat(item);
											setIsOpen(false);
										}}
									/>
								</li>
						))
						: renderNotFound('No groups found!')}
				</ul>
			</div>
		</Card>
	);
};

export default ChatSearchSuggestions;
