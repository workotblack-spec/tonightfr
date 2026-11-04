import { createFileRoute } from "@tanstack/react-router";
import { bearerMatches, extractOgImage, safeFetchHtml } from "@/lib/safe-fetch";

// Protected maintenance endpoint (CRON_SECRET bearer). For upcoming events with
// an allowlisted ticket_url and no image, fetch the page safely and store og:image.
const MAX_EVENTS = 20;

export const Route = createFileRoute("/api/public/backfill-images")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!bearerMatches(request.headers.get("authorization"), process.env.CRON_SECRET)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: events, error } = await supabaseAdmin
          .from("events")
          .select("id, ticket_url")
          .is("image_url", null)
          .not("ticket_url", "is", null)
          .gte("starts_at", new Date().toISOString())
          .limit(MAX_EVENTS);

        if (error) {
          console.error("[backfill-images] select failed");
          return Response.json({ ok: false }, { status: 500 });
        }

        let updated = 0;
        let skipped = 0;
        for (const ev of events ?? []) {
          const page = ev.ticket_url ? await safeFetchHtml(ev.ticket_url) : null;
          const img = page ? extractOgImage(page.html, page.finalUrl) : null;
          if (!img) {
            skipped++;
            continue;
          }
          const { error: uErr } = await supabaseAdmin
            .from("events")
            .update({ image_url: img })
            .eq("id", ev.id)
            .is("image_url", null);
          if (uErr) {
            console.error("[backfill-images] update failed");
            skipped++;
          } else updated++;
        }

        return Response.json({ ok: true, scanned: events?.length ?? 0, updated, skipped });
      },
    },
  },
});
