import LazyImage from '@/components/ui/lazy-image';
import LazyVideo from '@/components/ui/lazy-video';
import { Message } from '@/types/message';

type RendererProps = {
	type: string;
	content: Message['content'];
};

const MediaRenderer = ({ type, content }: RendererProps) => {
	if (type === 'image' && typeof content === 'object') {
		return (
			<a href={content?.download} className='mb-3' download>
				<LazyImage
					className='w-64 h-64 aspect-square rounded-md object-cover'
					src={content?.url}
					alt='chat image'
					loading='lazy'
				/>
			</a>
		);
	}

	if (type === 'video' && typeof content === 'object') {
		return (
			<a href={content?.download} className='mb-3' download>
				<LazyVideo
					className='aspect-video rounded-md object-cover'
					src={content?.url}
					controls
				/>
			</a>
		);
	}

	return null;
};

export const MessageRenderer = ({ type, content }: RendererProps) => {
	if (type === 'text' && typeof content === 'string') {
		return (
			<p className='text-lg font-medium text-white max-w-[90%] break-words'>
				{content ?? ''}
			</p>
		);
	}

	if ((type === 'image' || type === 'video') && typeof content === 'object') {
		return <MediaRenderer type={type} content={content} />;
	}

	return null;
};

export const MessageReplyRenderer = ({ type, content }: RendererProps) => {
	if (type === 'text' && typeof content === 'string') {
		return (
			<p className='text-lg font-medium text-white max-w-[90%] break-all text-ellipsis ellipsis-1'>
				{content?.substring(0, 100) ?? ''}
			</p>
		);
	}

	if ((type === 'image' || type === 'video') && typeof content === 'object') {
		return (
			<div className='flex items-center -mt-2 gap-4 justify-between'>
				<p className='text-lg font-medium text-white max-w-[90%] break-all text-ellipsis ellipsis-1'>
					Media 📎
				</p>
				<LazyImage
					src={content?.preview ?? ''}
					alt=''
					className='w-12 h-12 aspect-square rounded-md object-cover'
					loading='lazy'
				/>
			</div>
		);
	}
};
