import { Chat } from '@/types/chat';
import ChatAvatar from '../chat-listing-pane/chat-avatar';

import { User } from '@/types/auth';

export const UserSearchResult = ({ item, onClick }: { item: User; onClick: () => void }) => {
	return (
		<div
			className='flex gap-3 items-center cursor-pointer p-2 rounded-lg hover:bg-dark-grey'
			onClick={onClick}
		>
			<ChatAvatar
				img={`${item?.picture ?? 'https://i.pravatar.cc/300'}`}
				variant='rounded'
				size='sm'
			/>
			<p className='text-gray-300 text-opacity-90 font-medium capitalize ellipsis-1'>
				{item?.username}
			</p>
		</div>
	);
};

export const GroupSearchResult = ({ item, onClick }: { item: Chat; onClick: () => void }) => {
	return (
		<div
			className='flex gap-3 items-center cursor-pointer p-2 rounded-lg hover:bg-dark-grey'
			onClick={onClick}
		>
			<ChatAvatar
				img={`${`https://i.pravatar.cc/300/?u=${item?._id}`}`}
				variant='rounded'
				size='sm'
			/>
			<div>
				<p className='text-gray-300 text-opacity-90 font-medium capitalize ellipsis-1'>
					{item?.name}
				</p>
				<p className='text-gray-300 text-opacity-90 font-medium capitalize ellipsis-1'>
					{item?.lastMessage?.content ?? ''}
				</p>
			</div>
		</div>
	);
};
