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
import { MixerHorizontalIcon } from '@radix-ui/react-icons';

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

const SidebarMenu = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const window = searchParams.get('window') ?? 'all-chats';

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
		<ul className='flex flex-col items-center justify-center gap-4 mt-6 mb-6'>
			{MENU_ITEMS.map((item) => (
				<li
					className={`text-ellipsis text-center text-sm flex flex-col items-center hover:cursor-pointer after:block after:w-0 after:h-0.5 after:bg-gray-400 after:transition-[width] after:duration-200 after:ease-in ${
						isMenuActive(item.key)
							? 'text-purple-400 after:w-full font-semibold'
							: 'text-white hover:text-purple-400'
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

const BrandName = () => <h3 className='font-extrabold text-white text-3xl '>VI</h3>;

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
								getTextAvatar(user?.username ?? user?.email ?? '') ??
								placeholderImg
							}
							variant='rounded'
							size='sm'
							className='border-2 border-lime-300 '
						/>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='bg-gradient-dark text-white border-purple-900'>
					<DropdownMenuItem className='p-4 md:p-1' onClick={onProfileMenuClick}>
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem className='p-4 md:p-1' onClick={resetUser}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ProfileDrawer open={showProfile} setOpen={setShowProfile} />
		</>
	);
};

const AIChatTrigger = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { user } = useAuthInfo();

	if (!user?.ai) return null;

	const isAiChatActive =
		searchParams.get('window') === 'ai-chat' && searchParams.get('chat') === user?.ai;

	const handleClick = () => {
		searchParams.set('window', 'ai-chat');
		searchParams.set('chat', user?.ai?.toString()?.trim() ?? '');
		setSearchParams(searchParams.toString());
	};

	return (
		<span
			role='button'
			onClick={handleClick}
			className={`font-semibold text-md mx-4 md:mx-0 text-center cursor-pointer hover:scale-105 transition-all after:block after:w-0 after:h-0.5 after:bg-gray-400 after:transition-[width] after:duration-200 after:ease-in ${
				isAiChatActive
					? 'text-purple-400 after:w-full animate-none font-bold'
					: 'text-slate-300 hover:text-purple-400 animate-pulse'
			}`}
		>
			<span>AI ✨</span>
		</span>
	);
};

const ChatSidebar = () => {
	return (
		<aside className='hidden tablet:flex tablet:flex-col md:items-center h-100 bg-black p-5   min-w-24'>
			<BrandName />
			<SidebarMenu />
			<AIChatTrigger />
			<UserProfileMenu />
		</aside>
	);
};

export default ChatSidebar;

const MobileFilterChats = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const window = searchParams.get('window') ?? 'all-chats';
	const [open, setOpen] = useState(false);
	const isMenuActive = (key: string) => key === window;

	const handleMenuItemClick = (key: string) => {
		searchParams.set('window', key);
		setSearchParams(searchParams.toString());
	};
	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<MixerHorizontalIcon
					className={cn(
						'w-9 h-9 rounded-full cursor-pointer p-2.5 md:ml-3 text-zinc-300 hover:bg-dark-grey',
						{
							'border-2 border-gray-800 bg-black': !open,
							'bg-dark-grey border-2 border-gray-800': open,
						},
					)}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-gradient-dark text-white border-purple-900'>
				{MENU_ITEMS.map((item) => (
					<DropdownMenuItem
						key={item.key}
						onClick={() => handleMenuItemClick(item.key)}
						className={cn('p-4 md:p-1', {
							'text-gray-400': isMenuActive(item.key),
							'text-white hover:text-gray-200': !isMenuActive(item.key),
						})}
					>
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const MobileSidebarContent = () => {
	return (
		<div className='flex items-center justify-between gap-4 mb-8'>
			<BrandName />
			<div className='flex items-center '>
				<AIChatTrigger />
				<MobileFilterChats />
				<UserProfileMenu />
			</div>
		</div>
	);
};
