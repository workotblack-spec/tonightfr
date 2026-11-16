import { describe, expect, it } from "vitest";
import { buildSitemap, escapeXml, PUBLIC_ORIGIN, PUBLIC_PATHS } from "./sitemap";

describe("Public sitemap", () => {
  it("paginates beyond 1000 events without duplicates or invented lastmod", async () => {
    const rows = Array.from({ length: 1201 }, (_, id) => ({ id: String(id) }));
    const ranges: number[][] = [];
    const xml = await buildSitemap(async (from, to) => {
      ranges.push([from, to]); return { data: rows.slice(from, to + 1), error: null };
    });
    expect(ranges).toEqual([[0, 499], [500, 999], [1000, 1499]]);
    expect(xml.match(/<loc>/g)?.length).toBe(1201 + PUBLIC_PATHS.length);
    expect(xml).toContain(`${PUBLIC_ORIGIN}/event/1200`);
    expect(xml).not.toContain("lastmod");
  });
  it("fails rather than returning partial XML when a later source page fails", async () => {
    await expect(buildSitemap(async (from) => from === 0
      ? { data: Array.from({ length: 500 }, (_, id) => ({ id: String(id) })), error: null }
      : { data: null, error: new Error("failed") })).rejects.toThrow("Sitemap source unavailable");
  });
  it("encodes event IDs, escapes XML and includes only indexable public pages", async () => {
    const xml = await buildSitemap(async () => ({ data: [{ id: 'a&<>"/' }], error: null }));
    expect(xml).toContain("/event/a%26%3C%3E%22%2F");
    expect(escapeXml('&<>"\'')).toBe("&amp;&lt;&gt;&quot;&apos;");
    for (const path of ["/admin", "/auth", "/favorites", "/profile", "/pro", "/contact", "/legal", "/api/"]) {
      expect(xml).not.toContain(`<loc>${PUBLIC_ORIGIN}${path}</loc>`);
    }
    expect(xml).toContain(`<loc>${PUBLIC_ORIGIN}/promouvoir</loc>`);
  });
});