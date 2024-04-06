import { cn } from '@/lib/utils';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
import { Card } from './card';
import { DropdownMenuShortcut } from './dropdown-menu';
import { Input } from './input';
import Loader from './loader';

type SearchProps = {
	placeholder?: string;
	onChange: (v: string) => void;
	loading: boolean;
	renderSuggestions: ({
		isOpen,
		setIsOpen,
	}: {
		isOpen: boolean;
		setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	}) => React.ReactNode;

	shortcutKey?: string;
	className?: string;
	showIcon?: boolean;
};

export const Search = ({
	shortcutKey = 'k',
	onChange,
	loading,
	renderSuggestions,
	className,
	showIcon = true,
}: SearchProps) => {
	const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === shortcutKey && e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation()
				inputRef.current?.focus();
			}
			if (e.key === 'Escape' && isSuggestionsOpen) {
				setIsSuggestionsOpen(false);
				inputRef?.current?.blur();
			}
		};
		document.addEventListener('keydown', handler);

		return () => {
			document.removeEventListener('keydown', handler);
		};
	}, [isSuggestionsOpen, shortcutKey]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsSuggestionsOpen(true);
		onChange(e.target?.value);
	};

	return (
		<div
			className={cn(
				'relative rounded-lg outline-none border border-transparent focus-within:border-purple-900',
				className,
			)}
		>
			{showIcon && (
				<MagnifyingGlassIcon className='absolute top-[50%] left-3 translate-y-[-50%] text-gray-500' />
			)}
			<Input
				ref={inputRef}
				onChange={handleChange}
				placeholder='Find/Create Chats...'
				className={`${
					showIcon ? 'pl-8' : ''
				} focus-visible:ring-transparent border-none text-gray-300 placeholder:text-gray-500 placeholder:tracking-tight py-[1.4rem]  bg-black bg-opacity-80 rounded-xl shadow-sm placeholder:text-sm text-base`}
			/>
			{!inputRef?.current?.value && (
				<DropdownMenuShortcut className='absolute top-[50%] right-3 translate-y-[-50%] text-white'>
					⌘ {shortcutKey}
				</DropdownMenuShortcut>
			)}
			{loading ? (
				<Card className='flex flex-col items-center justify-center p-5 absolute top-full left-0 my-1 border-none shadow-xl w-full rounded-lg bg-black bg-opacity-90 outline-none'>
					<Loader size='30px' />
				</Card>
			) : null}
			{!loading &&
				isSuggestionsOpen &&
				renderSuggestions({
					isOpen: isSuggestionsOpen,
					setIsOpen: setIsSuggestionsOpen,
				})}
		</div>
	);
};

export default Search;
