import { Message } from '@/types/message';
import { MutableRefObject, useEffect, useRef } from 'react';

type RendererProps = {
	type: string;
	content: Message['content'];
};

const MediaRenderer = ({ type, content }: RendererProps) => {
	const elementRef = useRef<HTMLVideoElement | HTMLImageElement>(null);

	useEffect(() => {
		const target = elementRef?.current;
		const observer = new IntersectionObserver((entries) => {
			const [first] = entries;
			// @ts-expect-error content
			if (first?.isIntersecting && first?.target?.getAttribute('src') !== content?.url) {
				// @ts-expect-error content
				first?.target?.setAttribute('src', content?.url);
			}
		});
		if (target) {
			observer.observe(target);
		}
		return () => {
			observer.disconnect();
		};

		// @ts-expect-error content
	}, [content?.preview, content?.url, elementRef]);

	if (type === 'image' && typeof content === 'object') {
		return (
			<a href={content?.download} className='mb-3' download>
				<img
					ref={elementRef as MutableRefObject<HTMLImageElement>}
					className='w-64 h-64 aspect-square rounded-md object-cover'
					src={content?.preview ?? content?.url}
					alt='chat image'
					loading='lazy'
				/>
			</a>
		);
	}

	if (type === 'video' && typeof content === 'object') {
		return (
			<a href={content?.download} className='mb-3' download>
				<video
					ref={elementRef as MutableRefObject<HTMLVideoElement>}
					className='aspect-video rounded-md object-cover'
					src={content?.preview ?? content?.url}
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

	if (type === 'image' || (type === 'video' && typeof content === 'object')) {
		return <MediaRenderer type={type} content={content} />;
	}

	return null;
};
