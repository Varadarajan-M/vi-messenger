import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

type ChatAvatarProps = {
	variant: 'rounded' | 'block';
	img: string;
};

const ChatAvatar = ({ img, variant }: ChatAvatarProps) => {
	const avatarVariants = cva('w-12 h-12 min-w-12 min-h-12 overflow-hidden', {
		variants: {
			variant: {
				rounded: 'rounded-full',
				block: 'rounded-xl',
			},
		},
	});

	return (
		<div className={cn(avatarVariants({ variant }))}>
			<img src={img} alt='chat avatar' className='w-full h-full object-cover' />
		</div>
	);
};
export default ChatAvatar;
