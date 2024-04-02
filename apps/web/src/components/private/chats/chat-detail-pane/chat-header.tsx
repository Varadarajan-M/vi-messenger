import ChatAvatar from '../chat-listing-pane/chat-avatar';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MenuIcon = () => (
	<svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z'
			fill='#fff'
			fill-rule='evenodd'
			clip-rule='evenodd'
		></path>
	</svg>
);

const ChatHeader = () => {
	return (
		<header className='flex justify-between gap-4 sticky top-0'>
			<div className='flex gap-3 items-center cursor-pointer p-2 rounded-lg'>
				<ChatAvatar img={`${'https://i.pravatar.cc/300'}`} variant='block' size='sm' />
				<div className='flex flex-col'>
					<span className='text-white text-opacity-90 font-medium capitalize m-0 text-md'>
						{'John Doe'}
					</span>
					<span className='text-gray-500 text-opacity-90 capitalize -mt-1 text-sm'>
						Online
					</span>
				</div>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger className='focus-visible:outline-none h-max w-max self-center px-2.5 py-2 rounded-full data-[state=open]:bg-dark-grey transition-all'>
					<MenuIcon />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					// sideOffset={}
					className='mx-5 bg-dark-grey text-white border-none'
				>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Delete chat</DropdownMenuItem>
					<DropdownMenuItem>Chat Details</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
};

export default ChatHeader;
