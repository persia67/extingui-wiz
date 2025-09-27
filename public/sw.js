const CACHE_NAME = 'fire-extinguisher-v2';
const STATIC_CACHE = 'static-assets-v2';
const DYNAMIC_CACHE = 'dynamic-content-v2';

// Cache strategies
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(DYNAMIC_CACHE)
    ]).then(() => {
      self.skipWaiting();
    })
  );
});

// Fetch event with proper caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache static assets (JS, CSS, images) with cache-first strategy
  if (
    url.pathname.includes('/assets/') ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((fetchResponse) => {
            // Clone the response before caching
            const responseClone = fetchResponse.clone();
            if (fetchResponse.status === 200) {
              cache.put(request, responseClone);
            }
            return fetchResponse;
          });
        });
      })
    );
    return;
  }

  // Network-first for dynamic content
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response for caching
        const responseClone = response.clone();
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== CACHE_NAME
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});