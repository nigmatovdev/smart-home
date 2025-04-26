const CACHE_NAME = 'smart-home-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// URLs that should not be cached
const noCacheUrls = [
  '/api/proxy/',
  '/stream/',
  'index.m3u8'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Check if the request should be excluded from caching
  const shouldNotCache = noCacheUrls.some(url => requestUrl.includes(url));

  if (shouldNotCache) {
    // For proxy and stream requests, always fetch from network
    event.respondWith(fetch(event.request));
    return;
  }

  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 