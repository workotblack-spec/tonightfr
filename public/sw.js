const CACHE_NAME = "tonight-static-v2";
const CACHE_PREFIX = "tonight-";
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
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only explicitly approved, same-origin static assets may enter this cache.
  if (request.method !== "GET" || request.headers.has("authorization")) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !STATIC_ASSETS.has(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (!response.ok || response.headers.has("set-cookie")) return response;

      const cacheControl = response.headers.get("cache-control") || "";
      const directives = cacheControl.toLowerCase().split(",").map((value) => value.trim());
      if (directives.includes("private") || directives.includes("no-store")) return response;

      if ((response.headers.get("vary") || "").trim() === "*") return response;

      await cache.put(request, response.clone());
      return response;
    })
  );
});
