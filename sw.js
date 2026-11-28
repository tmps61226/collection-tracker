const C='ct-v467';
self.addEventListener('install',e=>{self.skipWaiting()});
/* 只清掉自己的舊快取（ct- 開頭），不動同一網域其他 app 的快取 */
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('ct-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const nav=r.mode==='navigate';
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res.ok){const c=res.clone();caches.open(C).then(x=>x.put(r,c))}return res}).catch(()=>caches.match(r).then(m=>m||(nav?caches.match(new URL('index.html',self.registration.scope).href):Response.error()))))});
