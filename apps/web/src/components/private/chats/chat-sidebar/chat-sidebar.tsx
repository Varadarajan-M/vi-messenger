import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuth from '@/hooks/auth/useAuth';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useMediaQuery from '@/hooks/common/useMediaQuery';
import { cn, getTextAvatar } from '@/lib/utils';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatAvatar from '../chat-listing-pane/chat-avatar';
import ProfileDrawer from './profile-drawer';

import placeholderImg from '@/assets/placeholder.webp';

const SidebarMenu = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const window = searchParams.get('window') ?? 'all-chats';

	const MENU_ITEMS = [
		{
			key: 'all-chats',
			label: 'All Chats',
			icon: '',
		},
		{
			key: 'groups',
			label: 'Groups',
			icon: '',
		},
		{
			key: 'dms',
			label: 'DMs',
			icon: '',
		},
	];

	const isMenuActive = (key: string) => key === window;

	const handleMenuItemClick = (key: string) => {
		searchParams.set('window', key);
		setSearchParams(searchParams.toString());
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleMenuItemClick(e.currentTarget.dataset.menuid!);
		}
	};

	return (
		<ul className='flex flex-col items-center justify-center gap-4'>
			{MENU_ITEMS.map((item) => (
				<li
					className={`text-ellipsis text-center text-sm flex flex-col items-center hover:cursor-pointer after:block after:w-0 after:h-0.5 after:bg-gray-400 after:transition-[width] after:duration-200 after:ease-in ${
						isMenuActive(item.key)
							? 'text-gray-400 after:w-full'
							: 'text-white hover:text-gray-200'
					} focus-visible:outline-none focus-visible:font-semibold`}
					data-menuid={item.key}
					key={item.label}
					onClick={() => handleMenuItemClick(item.key)}
					onKeyDown={handleKeyDown}
					tabIndex={0}
				>
					<span>{item.label}</span>
				</li>
			))}
		</ul>
	);
};

const BrandName = () => <h3 className='font-extrabold text-white text-3xl mb-10'>VI</h3>;

const UserProfileMenu = () => {
	const [showProfile, setShowProfile] = useState(false);
	const isSmallScreen = useMediaQuery('( max-width: 900px )');
	const { resetUser } = useAuth();
	const { user } = useAuthInfo();

	const onProfileMenuClick = () => {
		setShowProfile(!showProfile);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant={'ghost'}
						className={cn('hover:bg-transparent', {
							'mt-auto': !isSmallScreen,
							'mb-auto': isSmallScreen,
						})}
					>
						<ChatAvatar
							img={
								user?.picture ??
								getTextAvatar(user?.username ?? user?.email) ??
								placeholderImg
							}
							variant='rounded'
							size='sm'
							className='border-2 border-lime-300 '
						/>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='bg-gradient-dark text-white border-purple-900'>
					<DropdownMenuItem onClick={onProfileMenuClick}>Profile</DropdownMenuItem>
					<DropdownMenuItem onClick={resetUser}>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ProfileDrawer open={showProfile} setOpen={setShowProfile} />
		</>
	);
};

const ChatSidebar = () => {
	return (
		<aside className='hidden tablet:flex tablet:flex-col md:items-center h-100 bg-black p-5   min-w-24'>
			<BrandName />
			<SidebarMenu />
			<UserProfileMenu />
		</aside>
	);
};

export default ChatSidebar;

export const MobileSidebarContent = () => {
	return (
		<div className='flex items-center justify-between gap-4'>
			<BrandName />
			<UserProfileMenu />
		</div>
	);
};
