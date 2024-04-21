export const REACTION_NAME_MAP = {
	like: '👍🏻',
	love: '💖',
	swag: '😎',
	fire: '🔥',
	happy: '😀',
	sad: '😔',
	angry: '😡',
};

export const REACTIONS = Object.entries(REACTION_NAME_MAP).map(([key, value]) => ({
	label: value,
	value: key,
}));
