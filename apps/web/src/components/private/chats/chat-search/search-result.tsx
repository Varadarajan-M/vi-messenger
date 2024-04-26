import { Chat } from '@/types/chat';
import ChatAvatar from '../chat-listing-pane/chat-avatar';

import { getChatAvatar } from '@/lib/chat';
import { getTextAvatar } from '@/lib/utils';
import { User } from '@/types/auth';

import placeholderImg from '@/assets/placeholder.webp';

export const UserSearchResult = ({ item, onClick }: { item: User; onClick: () => void }) => {
	return (
		<div
			className='flex gap-3 items-center cursor-pointer p-2 rounded-lg hover:bg-dark-grey'
			onClick={onClick}
		>
			<ChatAvatar
				img={item?.picture ?? getTextAvatar(item?.username) ?? placeholderImg}
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
			<ChatAvatar img={getChatAvatar(item)} variant='rounded' size='sm' />
			<div>
				<p className='text-gray-300 text-opacity-90 font-medium capitalize ellipsis-1'>
					{item?.name}
				</p>
				<p className='text-gray-300 text-opacity-90 font-medium capitalize ellipsis-1'>
					{(typeof item?.lastMessage?.content === 'string' &&
						item?.lastMessage?.content) ??
						''}
				</p>
			</div>
		</div>
	);
};
