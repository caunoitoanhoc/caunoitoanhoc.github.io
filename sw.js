/* Cache only public application assets. No learner records or external services. */
'use strict';
const PREFIX='caunoi-ui:'+self.registration.scope+':';
const CACHE=PREFIX+'6.2.0';
const FILES=['./index.html','./assets/base.css','./assets/design.css','./assets/fonts.css','./assets/work-model.css','./assets/work-model.js','./assets/fonts/NotoSans.woff','./assets/fonts/NotoSerif.woff','./assets/fonts/NotoSerif-Italic.woff','./assets/config.js','./assets/app.js','./assets/bridge-cover.webp','./assets/brand.svg','./assets/icon-192.png','./assets/icon-512.png','./manifest.webmanifest'];
const ASSETS=new Set(FILES.map(x=>new URL(x,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(path,{cache:'reload'}))))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 const homeURL=new URL('./index.html',self.registration.scope).href;
 const isAppNav=event.request.mode==='navigate'&&(url.href.split('?')[0]===homeURL||url.href.split('?')[0]===self.registration.scope);
 if(!isAppNav&&!ASSETS.has(url.href))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{const response=await fetch(event.request);if(response.ok)await cache.put(isAppNav?homeURL:event.request,response.clone());return response;}
  catch(error){const cached=await cache.match(isAppNav?homeURL:event.request);if(cached)return cached;throw error;}
 })());
});
