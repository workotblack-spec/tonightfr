// Refresh existing app-shell registrations only. Never install a new worker:
// the same-path replacement owns cache deletion and unregisters after activation.
export async function retireLegacyWorker(
  serviceWorker: Pick<ServiceWorkerContainer, "getRegistrations">,
  origin: string,
): Promise<void> {
  const registrations = await serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => {
        return [registration.active, registration.waiting, registration.installing]
          .some((worker) => {
            if (!worker) return false;
            const url = new URL(worker.scriptURL);
            return url.origin === origin && url.pathname === "/sw.js";
          });
      })
      .map((registration) => registration.update()),
  );
}