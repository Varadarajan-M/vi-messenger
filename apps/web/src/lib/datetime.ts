import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getTimeFromDate = (date: string) => {
	return dayjs(date).format('hh:mm a');
};

export const getTimeFromNow = (date: string) => {
	return dayjs(date).fromNow();
};

export const getDate = (date: string) => {
	return dayjs(date).format('DD MMMM YYYY');
};
