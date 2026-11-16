import { afterEach, describe, expect, it, vi } from "vitest";

// Compatible bun test + vitest : pas de vi.hoisted ni vi.stubEnv.
let privilegedLoads = 0;
vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (options: unknown) => options }));
vi.mock("@/integrations/supabase/client.server", () => {
  privilegedLoads += 1;
  throw new Error("Privileged module must not load");
});

const previousSecret = process.env.CRON_SECRET;
afterEach(() => {
  if (previousSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = previousSecret;
});

describe("Maintenance authorization boundary", () => {
  for (const name of ["ingest", "backfill-images", "sync-cron-secret"]) {
    it(`${name} rejects missing/invalid authorization before privileged import`, async () => {
      process.env.CRON_SECRET = "synthetic-test-only";
      const modules = {
        ingest: () => import("../routes/api/public/ingest"),
        "backfill-images": () => import("../routes/api/public/backfill-images"),
        "sync-cron-secret": () => import("../routes/api/public/sync-cron-secret"),
      };
      const route = (await modules[name as keyof typeof modules]()).Route as unknown as {
        server: { handlers: { POST: (args: { request: Request }) => Promise<Response> } };
      };
      for (const headers of [new Headers(), new Headers({ authorization: "Bearer invalid-test-only" })]) {
        const response = await route.server.handlers.POST({ request: new Request("https://tonightfr.lovable.app/api/public/" + name, { method: "POST", headers }) });
        expect(response.status).toBe(401);
        expect(await response.text()).toBe("Unauthorized");
      }
      expect(privilegedLoads).toBe(0);
    });
  }
});
