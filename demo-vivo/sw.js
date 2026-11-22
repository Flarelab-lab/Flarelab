// Service worker: siempre pide la versión más nueva al servidor (sin caché del navegador); la copia guardada solo se usa sin señal.
// Al subir una versión nueva, cambia VERSION aquí y en index.html (APP_VERSION).
const VERSION='v7', C='flarelab-demo-'+VERSION, SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>Promise.all(SHELL.map(u=>fetch(u,{cache:'no-store'}).then(r=>c.put(u,r))))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(u.href,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
