import { Message } from '@/types/message';
import { useEffect, useRef } from 'react';

type RendererProps = {
	type: string;
	content: Message['content'];
};

const ImageRenderer = ({ type, content }: RendererProps) => {
	const imageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const target = imageRef?.current;
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
	}, [content?.preview, content?.url, imageRef]);

	if (type === 'image' && typeof content === 'object') {
		return (
			<a href={content?.download} download>
				<img
					ref={imageRef}
					className='w-64 h-64 aspect-square rounded-md object-cover z-[999999]'
					src={content?.preview ?? content?.url}
					alt='chat image'
					loading='lazy'
				/>
			</a>
		);
	}
};

export const MessageRenderer = ({ type, content }: RendererProps) => {
	if (type === 'text' && typeof content === 'string') {
		return <p className='text-sm font-medium text-white'>{content ?? ''}</p>;
	}

	if (type === 'image' && typeof content === 'object') {
		return <ImageRenderer type={type} content={content} />;
	}
	return null;
};
