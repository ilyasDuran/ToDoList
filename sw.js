/* Service Worker: todo-app-v1.0 */
const CACHE_NAME = 'todo-app-v1.0'; // Uygulamada büyük bir görsel değişiklik yaparsan v1.1 yap!
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Kurulum: Dosyaları Cache'e (Önbelleğe) al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dosyalar önbelleğe alınıyor...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. Aktivasyon: Eski cache'leri temizle (Güncelleme yönetimi)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski versiyon temizleniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3. Getirme: Önce Cache, internet varsa güncelle
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Önbellekte varsa onu döndür, yoksa internetten çek
      return response || fetch(event.request);
    })
  );
});
