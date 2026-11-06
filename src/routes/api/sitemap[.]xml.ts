import { createFileRoute } from "@tanstack/react-router";

// Legacy URL remains available; both paths serve the same public XML.
export const Route = createFileRoute("/api/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { sitemapResponse } = await import("@/lib/sitemap.server");
        return sitemapResponse();
      },
    },
  },
});
