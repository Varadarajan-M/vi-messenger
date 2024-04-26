export const registerSW = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(() => {
				console.log('Service worker registration successful:');
			})
			.catch((error) => {
				console.log('Service worker registration failed:', error);
			});
	}
};
