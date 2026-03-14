const CACHE_NAME = "smvip-cache-v1";
const urlsToCache = [
  "/index.html",
  "/admin.html",
  "/styles.css",
  "/scripts.js",
  "/firebase-config.js",
  "/icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});