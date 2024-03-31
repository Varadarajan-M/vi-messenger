import { useEffect, useRef, useState } from 'react';

const useDebouncedValue = (value: string | number, ms: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const timerId = useRef<NodeJS.Timeout | null>(null);
	useEffect(() => {
		if (timerId.current) {
			clearTimeout(timerId.current);
		}
		timerId.current = setTimeout(() => {
			setDebouncedValue(value);
		}, ms);
	}, [ms, value]);

	return debouncedValue;
};

export default useDebouncedValue;
