export const messagePopulationFields = {
	replyTo: {
		path: 'replyTo',
		select: {
			reactions: 0,
			seenBy: 0,
			replyTo: 0,
		},
		populate: {
			path: 'sender',
			select: '-password',
		},
	},
};
