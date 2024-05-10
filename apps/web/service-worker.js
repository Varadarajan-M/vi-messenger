const staticCacheName = 'chat-app-static-v2';
const dynamicCacheName = 'chat-app-dynamic-v2';

const offlineCacheName = 'chat-app-offline-v2';

const localAssetsToCache = [
	'https://upload-widget.cloudinary.com/global/all.js',
	'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&display=swap',
	'https://fonts.gstatic.com/s/archivo/v19/k3kBo8UDI-1M0wlSfdzyIEkpwTM29hr-8mTYCx-muLRm.woff2',
	'https://fonts.gstatic.com/s/archivo/v19/k3kBo8UDI-1M0wlSfdzyIEkpwTM29hr-8mTYCx6muLRm.woff2',
	'https://fonts.gstatic.com/s/archivo/v19/k3kBo8UDI-1M0wlSfdzyIEkpwTM29hr-8mTYCxCmuA.woff2',
	'https://fonts.gstatic.com/s/archivo/v19/k3kPo8UDI-1M0wlSV9XAw6lQkqWY8Q82sLySOxK-vA.woff2',
	'https://fonts.gstatic.com/s/archivo/v19/k3kPo8UDI-1M0wlSV9XAw6lQkqWY8Q82sLyTOxK-vA.woff2',
	'https://fonts.gstatic.com/s/archivo/v19/k3kPo8UDI-1M0wlSV9XAw6lQkqWY8Q82sLydOxI.woff2',
];

const offlinAssetsToCache = [
	'/',
	'/u/login',
	'/u/register',
	'/app',
	'/index.html',
	'/assets/index-8sauPqNY.css',
	'/assets/index-xRsAFY-3.js',
	'/assets/manifest-n25BX2ko.json',
];

async function cacheAssets(cache) {
	// console.log('caching static assets...');
	await cache.addAll(localAssetsToCache);
	// console.log('caching complete!');
}

async function cacheOfflineAssets(cache) {
	// console.log('caching offline assets...');
	await cache.addAll(offlinAssetsToCache);
	// console.log('caching complete!');
}

self.addEventListener('install', (event) => {
	// console.log('Service worker install event!');
	event.waitUntil(caches.open(staticCacheName).then(cacheAssets));
	event.waitUntil(caches.open(offlineCacheName).then(cacheOfflineAssets));
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	// console.log('Service worker activate event!');
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter(
						(cacheName) =>
							cacheName !== staticCacheName &&
							cacheName !== dynamicCacheName &&
							cacheName !== offlineCacheName,
					)
					.map((cacheName) => caches.delete(cacheName)),
			);
		}),
	);
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
	const resourcesToCache = [
		'api.dicebear.com',
		'res.cloudinary.com',
		'.jpg',
		'.png',
		'.jpeg',
		'.webp',
		'.svg',
		'.mp4',
	];
	const appUrl = `https://vi-messenger.onrender.com/api`;
	const wsUrl = `https://vi-messenger.onrender.com/socket.io`;

	if (
		event.request.url.includes('/u/login') ||
		event.request.url.includes('/u/register') ||
		event.request.url.includes(appUrl) ||
		event.request.url.includes(wsUrl) ||
		event.request.url.includes('wss://')
	)
		return;

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			return (
				cachedResponse ||
				fetch(event.request)
					.then(async (res) => {
						const cache = await caches.open(dynamicCacheName);
						if (resourcesToCache.some((r) => event.request.url.includes(r))) {
							await cache.put(event.request, res.clone());
						}
						return res;
					})
					.catch(() => caches.match(event.request).then((res) => res))
			);
		}),
	);
});
