import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const ChatSearch = () => {
	return (
		<div className='relative border-none outline-none'>
			<MagnifyingGlassIcon className='absolute top-[50%] left-3 translate-y-[-50%] text-gray-500' />
			<Input
				placeholder='Search'
				className='pl-8 focus-visible:ring-transparent border-none text-gray-300 placeholder:text-gray-500 placeholder:tracking-tight py-[1.4rem] bg-light-grey bg-opacity-60 rounded-xl shadow-sm placeholder:text-sm text-base'
			/>
		</div>
	);
};

export default ChatSearch;
