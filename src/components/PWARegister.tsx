import { useEffect } from "react";
import { retireLegacyWorker } from "@/lib/retire-legacy-worker";

// Home-screen support stays manifest-only. The same-path cleanup worker
// retires the legacy app-shell cache without touching unrelated workers.
export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void retireLegacyWorker(navigator.serviceWorker, window.location.origin).catch(() => undefined);
  }, []);
  return null;
}
