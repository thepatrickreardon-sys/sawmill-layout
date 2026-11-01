const V='turf-estimator-v5';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim();})());});
// network first so updates show up; fall back to cache with no signal
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&(new URL(e.request.url).origin===location.origin||e.request.url.includes('fonts.g'))){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));});
