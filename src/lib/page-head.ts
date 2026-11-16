const PUBLIC_ORIGIN = "https://tonightfr.lovable.app";

export function pageHead(path: string, title: string, description: string, privatePage = false) {
  const url = PUBLIC_ORIGIN + path;
  return {
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:locale", content: "fr_CH" },
      { property: "og:url", content: url }, { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
      ...(privatePage ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}