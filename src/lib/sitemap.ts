import type { Database } from "@/integrations/supabase/types";

export const PUBLIC_ORIGIN = "https://tonightfr.lovable.app";
export const PUBLIC_PATHS = ["/", "/explore", "/map", "/promouvoir", "/about"] as const;
const PAGE_SIZE = 500;
type EventId = Pick<Database["public"]["Tables"]["events"]["Row"], "id">;
type Page = { data: EventId[] | null; error: unknown };

export function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char] ?? char);
}

// No publication flag exists in generated event types. Anonymous SELECT/RLS
// remains the public boundary; only IDs are projected, never owner/contact data.
export async function buildSitemap(readPage: (from: number, to: number) => PromiseLike<Page>): Promise<string> {
  const ids = new Set<string>();
  for (let from = 0; ; from += PAGE_SIZE) {
    const page = await readPage(from, from + PAGE_SIZE - 1);
    if (page.error || !page.data) throw new Error("Sitemap source unavailable");
    for (const event of page.data) ids.add(event.id);
    if (page.data.length < PAGE_SIZE) break;
  }
  const paths = [...PUBLIC_PATHS, ...Array.from(ids, (id) => `/event/${encodeURIComponent(id)}`)];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(PUBLIC_ORIGIN + path)}</loc></url>`).join("")}</urlset>`;
}

