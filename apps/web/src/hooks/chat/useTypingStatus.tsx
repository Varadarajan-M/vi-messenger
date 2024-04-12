import { useTypingState } from '@/zustand/store';
import { useCallback, useState, useEffect } from 'react';

import useAuthInfo from '@/hooks/auth/useAuthInfo';

const useTypingStatus = (chatId?: string) => {
	const { user } = useAuthInfo();
	const setTypingStatus = useTypingState((state) => state.setTypingStatus);
	const typingState = useTypingState((state) => state.typingStatus);
	const [message, setMessage] = useState('');

	const onUpdateTypingStatus = useCallback(
		(data: any) => {
			setTypingStatus(data);
		},
		[setTypingStatus],
	);

	useEffect(() => {
		if (chatId) {
			let msg = '';
			if (typingState[chatId]) {
				console.log('typingState[chatId]', typingState[chatId]);
				const currentlyTypingCountExcludingMe: any = Object.keys(
					typingState[chatId],
				).filter((id) => id !== user?._id);

				if (currentlyTypingCountExcludingMe.length === 1) {
					const userTyping =
						typingState?.[chatId]?.[currentlyTypingCountExcludingMe?.[0]];
					msg = `${userTyping} is typing...`;
				}
				console.log(currentlyTypingCountExcludingMe);

				if (currentlyTypingCountExcludingMe.length > 1) {
					const user1 = typingState?.[chatId]?.[currentlyTypingCountExcludingMe?.[0]];
					const user2 = typingState?.[chatId]?.[currentlyTypingCountExcludingMe?.[1]];

					const remainingCount = currentlyTypingCountExcludingMe.length - 2;

					if (remainingCount > 0)
						msg = `${user1}, ${user2} and ${remainingCount} more are typing...`;
					else {
						msg = `${user1}, ${user2} are typing...`;
					}
				}
			}
			setMessage(msg);
		}
	}, [chatId, typingState, typingState?.[chatId], user?._id]);

	return { onUpdateTypingStatus, typingState, message };
};

export default useTypingStatus;
