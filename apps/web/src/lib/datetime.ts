import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getTimeFromDate = (date: string) => {
	return dayjs(date).format('hh:mm a');
};

export const getTimeFromNow = (date: string) => {
	return dayjs(date).fromNow();
};
