import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Idempotent sync: copies CRON_SECRET (runtime env) into Vault so pg_cron
// can read it dynamically. Safe to call without auth because it only writes
// the existing server-side secret value (no user input).
export const Route = createFileRoute("/api/public/sync-cron-secret")({
  server: {
    handlers: {
      POST: async () => {
        const secret = process.env.CRON_SECRET;
        if (!secret) return new Response("CRON_SECRET not set", { status: 500 });
        const { error } = await supabaseAdmin.rpc("sync_cron_secret_to_vault", {
          _value: secret,
        });
        if (error) return new Response(error.message, { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});

