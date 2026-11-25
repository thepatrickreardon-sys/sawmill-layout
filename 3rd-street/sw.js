const V='thirdst-v25';
const CORE=['./','index.html','docs-text.json','hardware.json','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon-maskable-512.png','../brand/turf-tek-logo-white.png','../brand/fonts/Satoshi-Regular.woff2','../brand/fonts/Satoshi-Medium.woff2','../brand/fonts/Satoshi-Bold.woff2','../brand/fonts/Satoshi-Black.woff2','../brand/fonts/Giften.woff'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys()) if(k!==V && k.startsWith('thirdst-v')) await caches.delete(k); // only this app's old caches: all jobs share one site
  await self.clients.claim();
  // fill in plan sheets in the background so the Docs tab works with no signal
  try{ const list=await (await fetch('sheets.json',{cache:'no-store'})).json(); const c=await caches.open(V);
    for(const p of list){ if(!(await c.match(p))){ try{ await c.add(p); }catch(_){} } } }catch(_){}
})());});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin && (u.pathname.endsWith('/')||u.pathname.endsWith('.html')||u.pathname.endsWith('.json'))){
    // network first for app + data so updates show up, cache when offline
    e.respondWith(fetch(u.href,{cache:'no-store',credentials:'same-origin'}).then(res=>{ if(res.ok){const cp=res.clone(); caches.open(V).then(c=>c.put(r,cp));} return res; }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
    return;
  }
  // the 3D scan is big: keep it in its own cache so app updates don't re-download it
  if(u.origin===location.origin && u.pathname.includes('/scan/')){ e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok){const cp=res.clone(); caches.open('thirdst-scan').then(c=>c.put(r,cp));} return res; }))); return; }
  // cache first for sheets, icons, fonts
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok||res.type==='opaque'){const cp=res.clone(); caches.open(V).then(c=>c.put(r,cp));} return res; })));
});
