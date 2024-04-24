/* eslint-disable no-mixed-spaces-and-tabs */
import { Card } from '@/components/ui/card';
import { UserSearchResult } from '../chat-search/search-result';

const SearchSuggestions = ({ suggestions, onItemClick }: any) => {
	return (
		<Card className='flex flex-col absolute top-full left-0 my-1 border-white shadow-xl w-full rounded-lg bg-black outline-none max-h-[10rem] overflow-auto'>
			<div className='p-5'>
				<ul className='flex flex-col gap-3'>
					{suggestions
						? suggestions?.map((item: any) => (
								<li key={item._id}>
									<UserSearchResult
										item={item}
										onClick={() => onItemClick(item)}
									/>
								</li>
						  ))
						: null}
				</ul>
			</div>
		</Card>
	);
};

export default SearchSuggestions;
