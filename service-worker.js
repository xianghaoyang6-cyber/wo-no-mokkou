const CACHE_NAME = 'qianggu-order-app-v1-12-icon-force-update';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.png',
  './icons/icon-192-v112.png',
  './icons/icon-512-v112.png',
  './icons/maskable-512-v112.png',
  './icons/apple-touch-icon-v112.png',
  './圖示/icon-192.png',
  './圖示/icon-512.png',
  './圖示/apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS).catch(function () { return undefined; });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(function (response) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(event.request, copy).catch(function () {});
      });
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        return cached || caches.match('./index.html');
      });
    })
  );
});
