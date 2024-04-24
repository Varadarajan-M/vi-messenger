import ChatAvatar from '../chat-listing-pane/chat-avatar';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	getChatAvatar,
	getGroupChatOnlineUserCount,
	getPrivateChatMemberId,
	getPrivateChatName,
} from '@/lib/chat';
import { User } from '@/types/auth';
import { Chat } from '@/types/chat';
import { ComponentPropsWithoutRef } from 'react';

export const MenuIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
	<svg
		width='15'
		height='15'
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		role='button'
		{...props}
	>
		<path
			d='M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z'
			fill='#fff'
			fillRule='evenodd'
			clipRule='evenodd'
		></path>
	</svg>
);

export const BackIcon = (props: ComponentPropsWithoutRef<'svg'>) => (
	<svg
		width='15'
		height='15'
		viewBox='0 0 15 15'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		role='button'
		{...props}
	>
		<path
			d='M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z'
			fill='lightgray'
			fillRule='evenodd'
			clipRule='evenodd'
		></path>
	</svg>
);

type ChatHeaderProps = {
	chat: Chat;
	loading: boolean;
	onlineUsers: Record<string, string[]>;
	onBackNavigation: () => void;
};

const OnlineText = () => (
	<p className='flex gap-1 items-center  -mt-1'>
		<span className='rounded-full h-2 w-2 bg-green-600 animate-pulse min-h-2 min-w-2 '></span>
		<span className='text-gray-400 capitalize text-sm'>Online</span>
	</p>
);

const AwayText = () => (
	<p className='flex gap-1 items-center -mt-1'>
		<span className='rounded-full h-2 w-2 bg-yellow-200 min-h-2 min-w-2 '></span>
		<span className='text-gray-400 capitalize text-sm'>Away</span>
	</p>
);

const GroupInfoText = ({ members, online }: { members: number; online: number }) => (
	<p className='flex gap-1 items-center -mt-1 pl-1'>
		<span className='rounded-full h-2 w-2 bg-yellow-200  min-h-2 min-w-2 '></span>
		<span className='text-gray-400 capitalize text-sm'>{members} members</span>
		<span className='rounded-full h-2 w-2 bg-green-600 animate-pulse min-h-2 min-w-2 '></span>
		<span className='text-gray-400 text-sm'>{online} online</span>
	</p>
);

const ChatHeader = ({ chat, loading, onlineUsers, onBackNavigation }: ChatHeaderProps) => {
	const renderSecondaryText = () => {
		if (chat?.admin) {
			const members = chat?.members?.length;
			const online = getGroupChatOnlineUserCount(onlineUsers, chat?.members as string[]);
			return <GroupInfoText members={members} online={online} />;
		}

		const memberId = getPrivateChatMemberId(chat?.members as User[]) || '';
		return onlineUsers?.[memberId] ? <OnlineText /> : <AwayText />;
	};
	return (
		<header className='flex bg-gradient-dark rounded-lg mb-3 justify-between gap-4 sticky top-0'>
			{loading && (
				<div className='w-full flex items-center p-2 justify-center animate-pulse text-white font-medium'>
					{/* TODO: Add Skeleton Here */}
					Loading chat details ...
				</div>
			)}
			{!loading && (
				<>
					<div className='flex gap-3 items-center cursor-pointer p-2 rounded-lg'>
						<BackIcon className='h-6 w-5' onClick={onBackNavigation} />

						<ChatAvatar img={getChatAvatar(chat)} variant='block' size='sm' />
						<div className='flex flex-col'>
							{!loading && (
								<span className='text-white  font-semibold capitalize m-0 text-md'>
									{!chat?.admin
										? getPrivateChatName(chat?.members as User[])
										: chat?.name}
								</span>
							)}
							{renderSecondaryText()}
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger className='focus-visible:outline-none h-max w-max self-center px-2.5 py-2 rounded-full data-[state=open]:bg-gradient-dark transition-all'>
							<MenuIcon className='h-5 w-5' />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							// sideOffset={}
							className='mx-5 bg-gradient-dark text-white border-none'
						>
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Delete chat</DropdownMenuItem>
							<DropdownMenuItem>Chat Details</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)}
		</header>
	);
};

export default ChatHeader;
