import LazyImage from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { memo } from 'react';

type ChatAvatarProps = {
	variant: 'rounded' | 'block';
	size: 'md' | 'sm' | 'xs';
	img: string;
	onClick?: () => void;
	className?: string;
};

const ChatAvatar = ({ img, variant, size = 'md', onClick, className }: ChatAvatarProps) => {
	const avatarVariants = cva('overflow-hidden', {
		variants: {
			variant: {
				rounded: 'rounded-full',
				block: 'rounded-xl',
			},
			size: {
				md: 'w-12 h-12 min-w-12 min-h-12',
				sm: 'w-8 h-8 min-w-8 min-h-8',
				xs: 'w-5 h-5 min-w-5 min-h-5',
			},
		},
	});

	return (
		<div className={cn(avatarVariants({ variant, size }), className)} onClick={onClick}>
			<LazyImage src={img} alt='chat avatar' className='w-full h-full object-cover' />
		</div>
	);
};
export default memo(ChatAvatar);
