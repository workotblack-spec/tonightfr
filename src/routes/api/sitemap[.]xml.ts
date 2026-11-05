import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://tonightfr.lovable.app";

export const Route = createFileRoute("/api/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.SUPABASE_URL;
        const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !publishableKey) {
          return new Response("Sitemap temporarily unavailable", { status: 503 });
        }

        const db = createClient(supabaseUrl, publishableKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data, error } = await db
          .from("events")
          .select("id")
          .gte("starts_at", new Date(Date.now() - 6 * 3600 * 1000).toISOString())
          .order("starts_at", { ascending: true })
          .limit(1000);

        if (error) {
          return new Response("Sitemap temporarily unavailable", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
          });
        }

        const staticUrls = ["/", "/explore", "/map", "/promouvoir", "/contact", "/about", "/legal"];
        const urls = [
          ...staticUrls.map(
            (path) => `<url><loc>${BASE}${path}</loc><changefreq>daily</changefreq></url>`,
          ),
          ...(data ?? []).map(
            (event) => `<url><loc>${BASE}/event/${encodeURIComponent(event.id)}</loc><changefreq>daily</changefreq></url>`,
          ),
        ].join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
