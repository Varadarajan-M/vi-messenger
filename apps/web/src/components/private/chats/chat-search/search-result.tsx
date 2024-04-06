import ChatAvatar from '../chat-listing-pane/chat-avatar';

import { User } from '@/types/auth';

export const UserSearchResult = ({ item, onClick }: { item: User; onClick: () => void }) => {
	return (
		<div
			className='flex gap-3 items-center cursor-pointer p-2 rounded-lg hover:bg-gradient-dark'
			onClick={onClick}
		>
			<ChatAvatar
				img={`${item?.picture ?? 'https://i.pravatar.cc/300'}`}
				variant='rounded'
				size='sm'
			/>
			<p className='text-gray-300 text-opacity-90 font-medium capitalize'>{item?.username}</p>
		</div>
	);
};
