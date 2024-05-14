import { cn } from '@/lib/utils';

const AIChatMessage = ({ sender }: { sender: string }) => {
	return (
		<div
			className={cn(
				'dark-b relative rounded-2xl pt-3 pr-3 pb-2 pl-3.5 flex flex-col min-w-28 max-w-[90%] md:max-w-[60%] break-all',
				{
					'self-end': sender === 'user',
					'self-start': sender === 'ai',
				},
			)}
		>
			<span className='text-sm self-start w-max text-purple-300 font-medium mb-1 hover:text-lime-300 cursor-pointer'>
				{sender === 'user' ? 'You🤹🏻' : 'VIM AI✨'}
			</span>
			<p className='text-md text-gray-300 font-medium'>
				Hello, how can I help you? Lorem ipsum dolor, sit amet consectetur adipisicing elit.
				Sint repellat aliquam dolores culpa alias cumque inventore nisi excepturi
				perferendis, itaque consequatur dolor! Sit, magnam! Laborum magnam obcaecati sint
				omnis magni?
			</p>
			<time className='text-xs text-gray-500 font-medium ml-auto'>10:30 AM</time>
		</div>
	);
};

export default AIChatMessage;
