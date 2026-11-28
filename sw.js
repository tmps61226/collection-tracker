const C='ct-v468';
/* 快取名稱綁定本 app 的路徑（scope），只清自己的舊快取 */
const P='ct@'+new URL(self.registration.scope).pathname+'@',K=P+C;
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>(x.startsWith(P)&&x!==K)||/^ct-v\d{3}$/.test(x)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const nav=r.mode==='navigate';
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res.ok){const c=res.clone();caches.open(K).then(x=>x.put(r,c))}return res}).catch(()=>caches.open(K).then(c=>c.match(r)).then(m=>m||(nav?caches.open(K).then(c=>c.match(new URL('index.html',self.registration.scope).href)):Response.error()))))});
