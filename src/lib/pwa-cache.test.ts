import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

function worker(failKeys = false) {
  const listeners = new Map<string, (event: { waitUntil: (p: Promise<unknown>) => void }) => void>();
  const remove = vi.fn().mockResolvedValue(true);
  const unregister = vi.fn().mockResolvedValue(true);
  const sandbox = {
    self: { addEventListener: (name: string, handler: typeof listeners extends Map<string, infer H> ? H : never) => listeners.set(name, handler),
      skipWaiting: vi.fn(), registration: { unregister },
      clients: { claim: vi.fn().mockResolvedValue(undefined), matchAll: vi.fn().mockResolvedValue([]) } },
    caches: { keys: failKeys ? vi.fn().mockRejectedValue(new Error("unavailable")) : vi.fn().mockResolvedValue([
      "tonight-v1", "tonight-static-v2", "tonight-fr-static-v3", "other-app", "firebase-messaging", "tonight-other",
    ]), delete: remove },
  };
  vm.runInNewContext(readFileSync(new URL("../../public/sw.js", import.meta.url), "utf8"), sandbox);
  return { listeners, remove, unregister };
}

describe("Tonight legacy worker retirement", () => {
  it("deletes only known Tonight caches and preserves other origin caches", async () => {
    const w = worker();
    let done: Promise<unknown> = Promise.resolve();
    w.listeners.get("activate")?.({ waitUntil: (p) => { done = p; } });
    await done;
    expect(w.remove.mock.calls.map(([name]) => name)).toEqual(["tonight-v1"]);
    expect(w.unregister).toHaveBeenCalledOnce();
  });
  it("unregisters even if storage enumeration fails", async () => {
    const w = worker(true);
    let done: Promise<unknown> = Promise.resolve();
    w.listeners.get("activate")?.({ waitUntil: (p) => { done = p; } });
    await expect(done).rejects.toThrow("unavailable");
    expect(w.unregister).toHaveBeenCalledOnce();
  });
  it("never intercepts navigation, API, auth, non-GET or even static requests", () => {
    expect(worker().listeners.has("fetch")).toBe(false);
  });
});