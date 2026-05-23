import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const BASE = "https://tonight.fr";

export const Route = createFileRoute("/api/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { data } = await supabaseAdmin
          .from("events")
          .select("id, starts_at")
          .gte("starts_at", new Date().toISOString())
          .limit(1000);

        const staticUrls = ["", "/map", "/about", "/legal"];
        const urls = [
          ...staticUrls.map(
            (p) =>
              `<url><loc>${BASE}${p}</loc><changefreq>daily</changefreq></url>`,
          ),
          ...(data ?? []).map(
            (e) =>
              `<url><loc>${BASE}/event/${e.id}</loc><lastmod>${new Date(e.starts_at).toISOString()}</lastmod></url>`,
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
