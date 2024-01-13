export const range = (start: number = 0, end: number, step = 1) => {
	let res: number[] = [];
	if (start < end) {
		for (let i = start; i < end; i += step) {
			res.push(i);
		}
	} else {
		for (let i = end; i > start; i -= step) {
			res.push(i);
		}
	}
	return res;
};
