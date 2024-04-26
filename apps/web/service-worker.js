const staticCacheName = 'chat-app-static-v1';
const dynamicCacheName = 'chat-app-dynamic-v1';

const localAssetsToCache = [
	'src/assets/chat_message.mp3',
	'src/assets/notification.wav',
	'src/assets/placeholder.webp',
];

async function cacheAssets(cache) {
	// console.log('caching static assets...');
	await cache.addAll(localAssetsToCache);
	// console.log('caching complete!');
}

self.addEventListener('install', (event) => {
	// console.log('Service worker install event!');
	event.waitUntil(caches.open(staticCacheName).then(cacheAssets));
});

self.addEventListener('activate', (event) => {
	// console.log('Service worker activate event!');
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter(
						(cacheName) =>
							cacheName !== staticCacheName && cacheName !== dynamicCacheName,
					)
					.map((cacheName) => caches.delete(cacheName)),
			);
		}),
	);
});

self.addEventListener('fetch', (event) => {
	const resourcesToCache = ['api.dicebear.com', 'res.cloudinary.com'];

	if (event.request.url.includes('/u/login')) return;

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) console.log('cache hit', event.request.url);
			return (
				cachedResponse ||
				fetch(event.request).then(async (res) => {
					const cache = await caches.open(dynamicCacheName);
					if (resourcesToCache.some((r) => event.request.url.includes(r))) {
						await cache.put(event.request, res.clone());
					}
					return res;
				})
			);
		}),
	);
});
