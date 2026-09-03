const CACHE='calculadoras-mx-v5.6.32-ziro-purple';
const CORE=['/','/index.html','/calculadoras.html','/simuladores.html','/articulos.html','/offline.html','/styles-v5628.css?v=5.6.28','/ziro-theme-v5632.css?v=5.6.32','/assets/js/catalog.js?v=5.1.0','/assets/js/common.js?v=5.1.0','/assets/img/logo.svg','/assets/img/favicon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('/offline.html'))));
    return;
  }
  if(url.pathname.startsWith('/assets/')||url.pathname.startsWith('/styles-')||url.pathname.startsWith('/ziro-theme-')){
    event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request)));
  }
});
