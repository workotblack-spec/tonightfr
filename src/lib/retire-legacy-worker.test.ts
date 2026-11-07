import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { retireLegacyWorker } from "./retire-legacy-worker";

const origin = "https://tonightfr.lovable.app";

function registration(path: string, state = "active") {
  return {
    [state]: { scriptURL: `${origin}${path}` },
    update: vi.fn().mockResolvedValue(undefined),
    unregister: vi.fn(),
  };
}

describe("legacy app-shell retirement", () => {
  it("updates existing /sw.js registrations instead of unregistering prematurely", async () => {
    const legacy = registration("/sw.js");
    const messaging = registration("/firebase-messaging-sw.js");
    const container = { getRegistrations: vi.fn().mockResolvedValue([legacy, messaging]) };
    await retireLegacyWorker(container, origin);
    expect(legacy.update).toHaveBeenCalledTimes(1);
    expect(legacy.unregister).not.toHaveBeenCalled();
    expect(messaging.update).not.toHaveBeenCalled();
    expect(messaging.unregister).not.toHaveBeenCalled();
  });

  it("does not create registrations for new visitors", async () => {
    const container = { getRegistrations: vi.fn().mockResolvedValue([]) };
    await expect(retireLegacyWorker(container, origin)).resolves.toBeUndefined();
    expect(container.getRegistrations).toHaveBeenCalledTimes(1);
  });

  it("finds an installing same-path worker and tolerates an update failure", async () => {
    const legacy = registration("/sw.js", "installing");
    legacy.update.mockRejectedValue(new Error("Offline"));
    await expect(retireLegacyWorker({ getRegistrations: vi.fn().mockResolvedValue([legacy]) }, origin))
      .resolves.toBeUndefined();
    expect(legacy.update).toHaveBeenCalledTimes(1);
    expect(legacy.unregister).not.toHaveBeenCalled();
  });

  it("ignores an unrelated worker on another origin", async () => {
    const foreign = registration("/sw.js");
    foreign.active.scriptURL = "https://example.com/sw.js";
    await retireLegacyWorker({ getRegistrations: vi.fn().mockResolvedValue([foreign]) }, origin);
    expect(foreign.update).not.toHaveBeenCalled();
  });
});

function cleanupHarness(failListing = false) {
  const handlers: Record<string, (event: { waitUntil: (work: Promise<unknown>) => void }) => void> = {};
  const remove = vi.fn().mockResolvedValue(true);
  const unregister = vi.fn().mockResolvedValue(true);
  const skipWaiting = vi.fn().mockResolvedValue(undefined);
  const claim = vi.fn();
  const matchAll = vi.fn();
  const keys = failListing
    ? vi.fn().mockRejectedValue(new Error("Storage unavailable"))
    : vi.fn().mockResolvedValue(["tonight-v1", "tonight-v10", "messaging-cache", "other-app"]);
  runInNewContext(readFileSync(new URL("../../public/sw.js", import.meta.url), "utf8"), {
    self: {
      addEventListener: (type: string, handler: typeof handlers[string]) => { handlers[type] = handler; },
      skipWaiting,
      registration: { unregister },
      clients: { claim, matchAll },
    },
    caches: { keys, delete: remove },
  });
  async function dispatch(type: string) {
    const handler = handlers[type];
    if (!handler) throw new Error(`Missing handler: ${type}`);
    let work: Promise<unknown> | undefined;
    handler({ waitUntil: (promise) => { work = promise; } });
    await work;
  }
  return { handlers, remove, unregister, skipWaiting, claim, matchAll, dispatch };
}

describe("same-path replacement cleanup worker", () => {
  it("activates immediately and deletes only exact tonight-v1 before unregistering", async () => {
    const worker = cleanupHarness();
    await worker.dispatch("install");
    expect(worker.skipWaiting).toHaveBeenCalledTimes(1);
    await worker.dispatch("activate");
    expect(worker.remove.mock.calls).toEqual([["tonight-v1"]]);
    expect(worker.unregister).toHaveBeenCalledTimes(1);
    expect(worker.remove.mock.invocationCallOrder[0]).toBeLessThan(worker.unregister.mock.invocationCallOrder[0]);
    expect(worker.claim).not.toHaveBeenCalled();
    expect(worker.matchAll).not.toHaveBeenCalled();
    expect(worker.handlers.fetch).toBeUndefined();
  });

  it("unregisters even when cache enumeration fails", async () => {
    const worker = cleanupHarness(true);
    await expect(worker.dispatch("activate")).rejects.toThrow("Storage unavailable");
    expect(worker.unregister).toHaveBeenCalledTimes(1);
    expect(worker.remove).not.toHaveBeenCalled();
  });
});