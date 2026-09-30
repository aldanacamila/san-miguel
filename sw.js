/**
 * sw.js — Service worker mínimo para que el sitio sea instalable (PWA / APK).
 * Estrategia "red primero": siempre muestra la versión publicada y solo usa la copia
 * guardada si no hay conexión. Nunca cachea las llamadas a Miguelito (/api/).
 */
var CACHE = 'sm-portal-v1';

self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.indexOf('/api/') > -1) return;
  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) { var copia = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
      return res;
    }).catch(function () { return caches.match(req); })
  );
});
