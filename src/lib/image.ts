// Route remote images through images.weserv.nl to bypass hotlink blocks,
// resize, and serve as WebP. Local imports and already-proxied URLs pass through.
export function proxied(url: string | null | undefined, width = 1024): string {
  if (!url) return "";
  // Local bundle assets (start with /) or data URIs — leave alone
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (!/^https?:\/\//i.test(url)) return url;
  // Already going through weserv
  if (url.includes("images.weserv.nl")) return url;
  // Unsplash already delivers optimized WebP with its own params — skip proxy
  if (/images\.unsplash\.com/.test(url)) return url;
  const stripped = url.replace(/^https?:\/\//i, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=${width}&output=webp&we&il`;
}
