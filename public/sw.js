const CACHE_NAME = "tonight-static-v2";
const STATIC_ASSETS = new Set([
  "/favicon.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([...STATIC_ASSETS]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never cache API responses, authenticated requests, navigations, or non-GET requests.
  // In particular, do not persist user-specific HTML or private application data.
  if (request.method !== "GET" || request.headers.has("authorization")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !STATIC_ASSETS.has(url.pathname)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response.ok) return response;
        if (response.headers.has("set-cookie")) return response;

        const cacheControl = response.headers.get("cache-control") || "";
        if (cacheControl.toLowerCase().includes("private") || cacheControl.toLowerCase().includes("no-store")) return response;

        const copy = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        );
        return response;
      });
    })
  );
});
