import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && token === expected;
}

// Idempotent sync: copies CRON_SECRET (runtime env) into Vault so pg_cron
// can read it dynamically. Requires the CRON_SECRET bearer token to prevent
// anonymous callers from triggering a privileged Vault write.
export const Route = createFileRoute("/api/public/sync-cron-secret")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const secret = process.env.CRON_SECRET!;
        const { error } = await supabaseAdmin.rpc("sync_cron_secret_to_vault", {
          _value: secret,
        });
        if (error) return new Response("Internal error", { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});
