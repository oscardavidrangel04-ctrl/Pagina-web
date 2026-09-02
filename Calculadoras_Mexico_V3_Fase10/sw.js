const CACHE='calculadoras-mx-v5.6.27';
const CORE=[
  '/index.html',
  '/calculadoras.html',
  '/simuladores.html',
  '/articulos.html',
  '/offline.html',
  '/styles-v5627.css?v=5.6.27',
  '/assets/js/catalog.js?v=5.1.0',
  '/assets/js/common.js?v=5.1.0',
  '/assets/img/logo.svg',
  '/assets/img/favicon.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const exact = await caches.match(event.request);
          if (exact) return exact;
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Serve any cached same-origin static resource while offline, including
  // root-level CSS such as /styles-v5627.css (the previous SW only handled /assets/).
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
