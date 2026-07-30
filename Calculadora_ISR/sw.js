
const CACHE = "calculadoras-mx-v1";
const CORE = [
  "/", "/index.html", "/calculadoras.html", "/articulos.html",
  "/assets/css/styles.css", "/assets/js/common.js", "/assets/js/optimize.js",
  "/assets/js/premium.js", "/assets/img/logo.svg", "/favicon.svg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response.ok && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached || caches.match("/404.html"));
      return cached || network;
    })
  );
});
