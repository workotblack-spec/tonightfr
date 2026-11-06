import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { sitemapResponse } = await import("@/lib/sitemap.server");
        return sitemapResponse();
      },
    },
  },
});