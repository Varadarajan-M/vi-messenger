import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LazyImage from '@/components/ui/lazy-image';
import LazyVideo from '@/components/ui/lazy-video';
import { cn } from '@/lib/utils';
import { Message } from '@/types/message';
import { DownloadIcon, FileIcon, PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type RendererProps = {
	type: string;
	content: Message['content'];
};

const FileMeta = ({
	content,
	className,
}: Pick<RendererProps, 'content'> & { className?: string }) => {
	const classes = cn('mt-3 flex justify-between gap-4', className);

	if (typeof content === 'object') {
		return (
			<div className={classes}>
				<div className='max-w-[90%]:'>
					<Link
						to={content?.download}
						className='text-zinc-300 text-sm hover:text-blue-300 text-ellipsis ellipsis-1 font-semibold'
					>
						{content?.fileName}
					</Link>
					<span className='text-zinc-500 text-xs hover:text-zinc-400 text-ellipsis ellipsis-1'>
						{content?.fileSize}
					</span>
				</div>
				<a href={content?.download} download>
					<DownloadIcon className='w-5 h-5 min-h-5 min-w-5 mt-1 text-white hover:text-blue-300 hover:scale-125 transition-all' />
				</a>
			</div>
		);
	}

	return null;
};

const MediaRenderer = ({ type, content }: RendererProps) => {
	const [open, setOpen] = useState(false);
	if (type === 'image' && typeof content === 'object') {
		return (
			<>
				<div className='mb-3'>
					<Dialog onOpenChange={setOpen} open={open}>
						<DialogTrigger>
							<LazyImage
								className={'w-64 h-64 aspect-square rounded-md object-cover'}
								src={content?.url}
								alt='chat image'
								loading='lazy'
							/>
						</DialogTrigger>
						<DialogContent className='sm:max-w-md rounded-sm w-max bg-black text-white border-none overflow-y-auto flex flex-col'>
							<LazyImage
								className={
									'max-h-[80lvh] max-w-[80lvw] aspect-square rounded-md object-cover'
								}
								src={content?.url}
								alt='chat image'
								loading='lazy'
							/>
						</DialogContent>
					</Dialog>
					<FileMeta content={content} />
				</div>
			</>
		);
	}

	if (type === 'video' && typeof content === 'object') {
		const Icon = !open ? PlayIcon : PauseIcon;
		return (
			<div className='mb-3'>
				<Dialog onOpenChange={setOpen} open={open}>
					<DialogTrigger>
						<div className='relative'>
							<LazyVideo
								className='aspect-video rounded-md object-cover'
								src={content?.url}
							/>
							<Icon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-10 min-h-12 min-w-12 text-white bg-gray-800 bg-opacity-60 rounded-full p-2 hover:scale-125 transition-all' />
						</div>
					</DialogTrigger>
					<DialogContent className='sm:max-w-md rounded-sm w-max bg-black text-white border-none overflow-y-auto flex flex-col'>
						<LazyVideo
							className='max-h-[80lvh] max-w-[80lvw] rounded-md object-cover'
							src={content?.url}
							autoPlay
							controls
						/>
					</DialogContent>
				</Dialog>
				<FileMeta content={content} />
			</div>
		);
	}

	return null;
};

export const MessageRenderer = ({ type, content }: RendererProps) => {
	if (type === 'text' && typeof content === 'string') {
		return (
			<p className='text-lg font-medium text-white max-w-[90%] break-words'>
				{content ?? ''}
			</p>
		);
	}

	if ((type === 'image' || type === 'video') && typeof content === 'object') {
		return <MediaRenderer type={type} content={content} />;
	}

	if (type === 'file' && typeof content === 'object') {
		return (
			<div className='flex cursor-pointer mr-6 mb-1 -mt-1 items-start gap-2 text-white p-3 px-4 bg-zinc-900 bg-opacity-50 rounded-2xl max-w-[98%]'>
				<FileIcon className='w-6 h-6 min-h-4 min-w-4 hover:text-zinc-400 mt-1' />
				<FileMeta content={content} className='mt-0' />
			</div>
		);
	}

	return null;
};

export const MessageReplyRenderer = ({ type, content }: RendererProps) => {
	if (type === 'text' && typeof content === 'string') {
		return (
			<p className='text-lg font-medium text-white max-w-[90%] break-all text-ellipsis ellipsis-1'>
				{content?.substring(0, 100) ?? ''}
			</p>
		);
	}

	if ((type === 'image' || type === 'video') && typeof content === 'object') {
		return (
			<div className='flex items-center -mt-2 gap-4 justify-between'>
				<p className='text-lg font-medium text-white max-w-[90%] break-all text-ellipsis ellipsis-1'>
					Media 📎
				</p>
				<LazyImage
					src={content?.preview ?? ''}
					alt=''
					className='w-12 h-12 aspect-square rounded-md object-cover'
					loading='lazy'
				/>
			</div>
		);
	}

	if (type === 'file' && typeof content === 'object') {
		return (
			<div className='flex items-center gap-2 text-white'>
				<FileIcon className='w-4 h-4 min-h-4 min-w-4 hover:text-zinc-400 ' />
				<span className='text-zinc-300 text-sm hover:text-zinc-400 text-ellipsis ellipsis-1 font-semibold'>
					{content?.fileName ?? 'File'}
				</span>
			</div>
		);
	}
};
