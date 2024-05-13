import { getTextAvatar } from '@/lib/utils';
import ChatAvatar from '../private/chats/chat-listing-pane/chat-avatar';
import { BackIcon } from '../private/chats/chat-message-pane/chat-header';

interface AIChatHeaderProps {
	onBackNavigation: () => void;
}

const AIChatHeader = ({ onBackNavigation }: AIChatHeaderProps) => {
	return (
		<header className='flex bg-gradient-dark rounded-lg mb-3 justify-between gap-4 sticky top-0'>
			<div className='flex gap-3 items-center cursor-pointer p-2 rounded-lg'>
				<BackIcon className='h-6 w-5' onClick={onBackNavigation} />
				<ChatAvatar img={getTextAvatar('AI✨') ?? ''} variant='block' size='sm' />
				<div className='flex flex-col'>
					{
						<span className='text-white  font-semibold capitalize m-0 text-md'>
							VIM AI✨
						</span>
					}
				</div>
			</div>
		</header>
	);
};

export default AIChatHeader;
