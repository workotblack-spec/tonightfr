const BASE = "https://tonightfr.lovable.app";

export async function sitemapResponse(): Promise<Response> {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return new Response("Sitemap unavailable", { status: 503 });
  const db = createClient(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  // Keep the existing six-hour grace window for ongoing nights.
  const cutoff = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
  const eventIds: string[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await db.from("events").select("id")
      .gte("starts_at", cutoff).order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) return new Response("Sitemap unavailable", { status: 503 });
    eventIds.push(...(data ?? []).map((event) => event.id));
    if (!data || data.length < pageSize) break;
  }
  // Contact and legal intentionally retain noindex; private pages stay excluded.
  const paths = ["/", "/explore", "/map", "/promouvoir", "/about",
    ...eventIds.map((id) => `/event/${encodeURIComponent(id)}`)];
  const urls = paths.map((path) => `<url><loc>${BASE}${path}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}