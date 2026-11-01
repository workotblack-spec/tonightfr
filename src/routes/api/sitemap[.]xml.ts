import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://tonightfr.lovable.app";

export const Route = createFileRoute("/api/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("events")
          .select("id")
          .gte("starts_at", new Date(Date.now() - 6 * 3600 * 1000).toISOString())
          .order("starts_at", { ascending: true })
          .limit(1000);
        if (error) return new Response("Sitemap unavailable", { status: 503 });

        const staticUrls = ["/", "/explore", "/map", "/promouvoir", "/contact", "/about", "/legal"];
        const urls = [
          ...staticUrls.map((p) => `<url><loc>${BASE}${p}</loc><changefreq>daily</changefreq></url>`),
          ...(data ?? []).map((e) => `<url><loc>${BASE}/event/${e.id}</loc><changefreq>daily</changefreq></url>`),
        ].join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
