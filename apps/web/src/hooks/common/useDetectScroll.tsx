import { useEffect, useState } from 'react';

const useDetectScroll = (id: string) => {
	const [scrolling, setScrolling] = useState(false);

	useEffect(() => {
		const el = document.getElementById(id)!;

		const scrollHandler = () => {
			setScrolling(true);
		};

		const scrollEndHandler = () => {
			setScrolling(false);
		};

		if (el) {
			el.addEventListener('scroll', scrollHandler);
			el.addEventListener('scrollend', scrollEndHandler);

			return () => {
				el.removeEventListener('scroll', scrollHandler);
				el.removeEventListener('scrollend', scrollEndHandler);
			};
		}
	}, [id]);

	return scrolling;
};

export default useDetectScroll;
