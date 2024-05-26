import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getTextAvatar = (name: string) => {
	if (!name.trim().length) return;
	return `https://api.dicebear.com/8.x/initials/svg?seed=${name}`;
};

const isValidFormat = (format: string, sourceFormats: string[]) =>
	sourceFormats.includes(format?.toUpperCase());

export const isValidImageFormat = (format: string) =>
	isValidFormat(format, ['PNG', 'JPG', 'JPEG', 'SVG', 'WEBP']);

export const isValidFileFormat = (format: string) =>
	isValidFormat(format, ['PDF', 'MP3', 'DOCX', 'XLSX', 'PPTX', 'TXT', 'ZIP']);

export const formatFileSize = (fileSizeBytes: number): string => {
	if (fileSizeBytes < 1024) {
		return `${fileSizeBytes} bytes`;
	} else if (fileSizeBytes < 1024 * 1024) {
		return `${(fileSizeBytes / 1024).toFixed(2)} KB`;
	} else if (fileSizeBytes < 1024 * 1024 * 1024) {
		return `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`;
	} else {
		return `${(fileSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	}
};

export async function fetchStream(
	url: string,
	options: any,
	callbacks: {
		onMessage: (data: string) => void;
		onEnd: () => void;
	},
) {
	const response = await fetch(url, options);

	if (!response?.body) {
		throw new Error('Response body is empty');
	}

	const reader = response.body?.pipeThrough(new TextDecoderStream())?.getReader();

	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			callbacks?.onEnd?.();
			break;
		}

		callbacks?.onMessage?.(value);
	}
}
