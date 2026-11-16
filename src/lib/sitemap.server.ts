import type { Database } from "@/integrations/supabase/types";
import { buildSitemap } from "./sitemap";

export async function sitemapResponse(): Promise<Response> {
  const unavailable = () => new Response("Sitemap temporarily unavailable", {
    status: 503, headers: { "Cache-Control": "no-store" },
  });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return unavailable();
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const db = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const cutoff = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
    const xml = await buildSitemap((from, to) => db.from("events").select("id")
      .gte("starts_at", cutoff).order("starts_at", { ascending: true })
      .order("id", { ascending: true }).range(from, to));
    return new Response(xml, { headers: {
      "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600",
    } });
  } catch { return unavailable(); }
}