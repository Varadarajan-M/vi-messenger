import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

type ChatAvatarProps = {
	variant: 'rounded' | 'block';
	size: 'md' | 'sm';
	img: string;
};

const ChatAvatar = ({ img, variant, size = 'md' }: ChatAvatarProps) => {
	const avatarVariants = cva('overflow-hidden', {
		variants: {
			variant: {
				rounded: 'rounded-full',
				block: 'rounded-xl',
			},
			size: {
				md: 'w-12 h-12 min-w-12 min-h-12',
				sm: 'w-8 h-8 min-w-8 min-h-8',
			},
		},
	});

	return (
		<div className={cn(avatarVariants({ variant, size }))}>
			<img src={img} alt='chat avatar' className='w-full h-full object-cover' />
		</div>
	);
};
export default ChatAvatar;
