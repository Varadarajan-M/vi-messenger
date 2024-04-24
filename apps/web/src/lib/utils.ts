import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getTextAvatar = (name: string) => {
	return `https://api.dicebear.com/8.x/initials/svg?seed=${name}`;
};
