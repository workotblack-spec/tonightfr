import { createFileRoute } from "@tanstack/react-router";

// Legacy URL remains available; both paths serve the same public XML.
// The draft's paginated, escaped XML builder is invoked behind this server boundary.
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
