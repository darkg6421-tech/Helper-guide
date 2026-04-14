const CACHE_NAME='helper-guide-v2';
const urlsToCache=[
  '/','/index.html','/offline.html','/css/style.css','/js/script.js','/js/search.js','/js/analytics.js',
  '/aadhaar-guide.html','/pan-guide.html','/driving-licence.html','/passport.html','/status-check.html','/blog.html',
  '/blog-aadhaar-pvc.html','/blog-pan-2.html','/blog-passport-rules.html','/about.html','/contact.html','/404.html'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)));
});
self.addEventListener('fetch',event=>{
  event.respondWith(
    caches.match(event.request).then(response=>{
      return response||fetch(event.request).catch(()=>caches.match('/offline.html'));
    })
  );
});
