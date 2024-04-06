import { findUsers } from '@/api/user';
import Search from '@/components/ui/search';
import { User } from '@/types/auth';
import { useState } from 'react';
import { UserSearchResult } from '../chat-search/search-result';
import SearchSuggestions from './search-suggestions';

const AddMembers = ({
	selectedUsers,
	setSelectedUsers,
	currentUser,
}: {
	selectedUsers: any[];
	setSelectedUsers: React.Dispatch<React.SetStateAction<any[]>>;
	currentUser: User | null;
}) => {
	// TODO: 👇🏻 refactor this into a custom hook after it is implemented fully

	const [loading, setLoading] = useState(false);
	const [searchResults, setSearchResults] = useState<any[]>([]);

	const onSearch = async (query: string) => {
		try {
			setLoading(true);
			const res = (await findUsers(query)) as { users: any[] };
			setSearchResults(res?.users);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const onSuggestionClick = (user: any, cb: (arg0: boolean) => void) => {
		if (!selectedUsers.some((u) => u._id === user._id) && currentUser?._id !== user._id) {
			setSelectedUsers([...selectedUsers, user]);
		}
		cb(false);
	};

	const onSelectedItemClick = (user: any) => {
		if (currentUser?._id === user._id) return;

		setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
	};

	return (
		<div className='flex flex-col gap-2'>
			<Search
				className='border border-purple-950 focus-within:border-blue-300'
				placeholder='Search users'
				loading={loading}
				onChange={onSearch}
				showIcon={false}
				renderSuggestions={({ setIsOpen }) => (
					<SearchSuggestions
						suggestions={searchResults}
						onItemClick={(user: any) => {
							onSuggestionClick(user, setIsOpen);
						}}
					/>
				)}
			/>
			<div className='min-w-full max-h-48 min-h-48 bg-dark-grey bg-opacity-50 rounded-lg overflow-y-auto'>
				{selectedUsers.length > 0 && (
					<h5 className='text-gray-400 font-semibold p-2'>Group Members</h5>
				)}
				{selectedUsers.map((user, index) => (
					<UserSearchResult
						key={index}
						item={user}
						onClick={() => onSelectedItemClick(user)}
					/>
				))}
			</div>
		</div>
	);
};

export default AddMembers;
