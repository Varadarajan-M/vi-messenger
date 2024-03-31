import { useSearchParams } from 'react-router-dom';

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

const ChatSidebar = () => {
	return (
		<aside className='h-100 bg-black p-5 flex flex-col items-center min-w-24'>
			<BrandName />
			<SidebarMenu />
		</aside>
	);
};

export default ChatSidebar;
