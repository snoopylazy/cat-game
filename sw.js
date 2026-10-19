/* Cat vs Cat — service worker
   Keeps the game installable + playable offline.
   App code (HTML/CSS/JS) is network-first so a fresh copy always wins when
   you're online, falling back to cache when offline. Audio is cache-first
   because the meow files are big and never change. */
const VERSION = 'catvscat-v2';
const SHELL = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.webmanifest',
  './icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .catch(() => {})                 // a missing file must not block install
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;   // only handle same-origin

  // Audio: cache-first (immutable, avoids re-downloading meows)
  if(req.destination === 'audio' || /\.(mp3|wav|ogg)$/i.test(url.pathname)){
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if(res && res.status === 200){
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
    return;
  }

  // App shell + everything else: network-first, fall back to cache when offline
  e.respondWith(
    fetch(req).then(res => {
      if(res && res.status === 200){
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
