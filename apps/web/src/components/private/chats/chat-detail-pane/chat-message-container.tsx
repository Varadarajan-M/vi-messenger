const ChatMessageContainer = () => {
	return (
		<section className='flex-1 bg-dark-grey w-full overflow-auto'>
			<div className='p-4'>
				<p className='text-xl text-white'>Chat Messages</p>
			</div>

			<div className='sticky bottom-0 top-full bg-black p-3 w-full'>
				<h1 className='text-xl text-white'>Input box</h1>
			</div>
		</section>
	);
};

export default ChatMessageContainer;
