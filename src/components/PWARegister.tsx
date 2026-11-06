import { useEffect } from "react";

// Home-screen support stays manifest-only. The same-path cleanup worker
// retires the legacy app-shell cache without touching unrelated workers.
export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      await Promise.allSettled(registrations.filter((registration) => {
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        if (!worker) return false;
        const url = new URL(worker.scriptURL);
        return url.origin === window.location.origin && url.pathname === "/sw.js";
      }).map((registration) => registration.unregister()));
    }).catch(() => undefined);
  }, []);
  return null;
}
