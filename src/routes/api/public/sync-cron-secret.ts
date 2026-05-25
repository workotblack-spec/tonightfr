import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// One-shot endpoint: copies CRON_SECRET (runtime env) into Supabase Vault
// so pg_cron can read it dynamically without hardcoding the value.
// Protected by the secret itself.
export const Route = createFileRoute("/api/public/sync-cron-secret")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        if (!secret) return new Response("CRON_SECRET not set", { status: 500 });

        const auth = request.headers.get("authorization") ?? "";
        if (auth !== `Bearer ${secret}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        // Upsert into vault via RPC
        const { error } = await supabaseAdmin.rpc("sync_cron_secret_to_vault", {
          _value: secret,
        });
        if (error) return new Response(error.message, { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});
