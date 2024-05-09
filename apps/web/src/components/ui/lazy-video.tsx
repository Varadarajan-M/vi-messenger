import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

const LazyVideo = (props: ComponentPropsWithoutRef<'video'>) => {
	const elementRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const target = elementRef?.current;
		const observer = new IntersectionObserver((entries) => {
			const [first] = entries;
			if (first?.isIntersecting && first?.target?.getAttribute('src') !== props?.src) {
				first?.target?.setAttribute('src', props?.src as string);
			}
		});
		if (target) {
			observer.observe(target);
		}
		return () => {
			observer.disconnect();
		};
	}, [elementRef, props?.src]);

	return <video {...props} src={''} ref={elementRef} />;
};

export default LazyVideo;
