import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Public endpoint: for each event missing image_url but with a ticket_url,
// fetch the page and extract og:image / twitter:image. Free, no API keys.

async function extractOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TonightFRBot/1.0; +https://tonightfr.lovable.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Limit to <head> to reduce regex work
    const head = html.slice(0, 60000);
    const patterns = [
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    ];
    for (const re of patterns) {
      const m = head.match(re);
      if (m && m[1]) {
        let u = m[1].trim();
        if (u.startsWith("//")) u = "https:" + u;
        else if (u.startsWith("/")) {
          const origin = new URL(url).origin;
          u = origin + u;
        }
        if (/^https?:\/\//i.test(u)) return u;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/public/backfill-images")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);

        const { data: events, error } = await supabaseAdmin
          .from("events")
          .select("id, ticket_url")
          .is("image_url", null)
          .not("ticket_url", "is", null)
          .gte("starts_at", new Date().toISOString())
          .limit(limit);

        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const list = events ?? [];
        let updated = 0;
        let failed = 0;
        const samples: { id: string; image_url?: string; reason?: string }[] = [];

        // Sequential to be gentle with target sites
        for (const ev of list) {
          if (!ev.ticket_url) continue;
          const img = await extractOgImage(ev.ticket_url);
          if (img) {
            const { error: uErr } = await supabaseAdmin
              .from("events")
              .update({ image_url: img })
              .eq("id", ev.id);
            if (uErr) {
              failed++;
              samples.push({ id: ev.id, reason: uErr.message });
            } else {
              updated++;
              if (samples.length < 5) samples.push({ id: ev.id, image_url: img });
            }
          } else {
            failed++;
          }
        }

        return new Response(
          JSON.stringify({ scanned: list.length, updated, failed, samples }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
