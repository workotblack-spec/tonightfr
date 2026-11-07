// One-release kill switch for the deployed legacy Tonight app-shell worker.
// Delete only the exact cache owned by that worker; messaging caches stay intact.
self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const names = await caches.keys();
        await Promise.allSettled(
          names.filter((name) => name === "tonight-v1").map((name) => caches.delete(name)),
        );
      } finally {
        await self.registration.unregister();
      }
    })(),
  );
});
