import { useEffect, useRef } from 'react';

const InfiniteScroll = ({
	fetcher,
	scrollableElementId,
}: {
	fetcher: () => void;
	scrollableElementId?: string;
}) => {
	const elementRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const target = elementRef?.current;
		const observer = new IntersectionObserver((entries) => {
			const [first] = entries;
			if (first?.isIntersecting) {
				fetcher();
			}
		});
		if (target) {
			observer.observe(target);
		}
		return () => {
			observer.disconnect();
		};
	}, [fetcher, elementRef, scrollableElementId]);
	return (
		<div ref={elementRef} className='text-white'>
			Infinite scroll
		</div>
	);
};

export default InfiniteScroll;
