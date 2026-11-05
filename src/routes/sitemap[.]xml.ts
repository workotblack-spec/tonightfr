import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://tonightfr.lovable.app";
const STATIC_PATHS = ["/", "/explore", "/map", "/promouvoir", "/contact", "/about", "/legal"];

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character];
  });
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !publishableKey) {
          return new Response("Sitemap temporarily unavailable", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }

        const { createClient } = await import("@supabase/supabase-js");
        const db = createClient(supabaseUrl, publishableKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        // The current events schema has no publication flag. Public RLS SELECT is
        // the visibility boundary; only future/ongoing public rows are listed.
        const { data, error } = await db
          .from("events")
          .select("id")
          .gte("starts_at", new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())
          .order("starts_at", { ascending: true })
          .limit(1000);

        if (error) {
          return new Response("Sitemap temporarily unavailable", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }

        const locations = [
          ...STATIC_PATHS.map((path) => `${BASE}${path}`),
          ...(data ?? []).map((event) => `${BASE}/event/${encodeURIComponent(event.id)}`),
        ];

        const entries = locations
          .map((location) => `<url><loc>${escapeXml(location)}</loc></url>`)
          .join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
