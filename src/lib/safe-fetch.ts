// Outbound fetch guard for server routes that follow URLs coming from data
// (ticket pages, og:image). Blocks SSRF: allowlisted hosts only, HTTPS only,
// no private/reserved IPs, manual redirect re-validation, time/size limits.

export const ALLOWED_TICKET_DOMAINS = [
  "fri-son.ch",
  "nouveaumonde.ch",
  "fribourgtourisme.ch",
  "belluard.ch",
  "equilibre-nuithonie.ch",
  "badbonn.ch",
  "zoya-bar.ch",
  "lacave.ch",
  "cafedelaloyaute.ch",
  "lesdocks.ch",
  "mad.club",
  "dclub.ch",
  "laromandie.ch",
  "fondation-hermitage.ch",
  "lausanne-tourisme.ch",
  "the-great.ch",
  "globull.ch",
  "ebull.ch",
  "co2bulle.ch",
  "la-gruyere.ch",
  "laspirale.ch",
] as const;

const MAX_URL_LENGTH = 2048;

function isIpLiteral(host: string): boolean {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  if (host.startsWith("[") || host.includes(":")) return true; // IPv6 (incl. ::ffff:)
  if (/^0x[0-9a-f]+$/i.test(host) || /^\d+$/.test(host)) return true; // decimal/hex IPv4
  return false;
}

const LOCAL_SUFFIXES = [".local", ".internal", ".localhost", ".lan", ".home", ".corp"];

export function isHostAllowed(host: string, allowed: readonly string[] = ALLOWED_TICKET_DOMAINS): boolean {
  const h = host.toLowerCase().replace(/\.$/, "");
  if (!h || isIpLiteral(h) || h === "localhost") return false;
  if (LOCAL_SUFFIXES.some((s) => h.endsWith(s))) return false;
  return allowed.some((d) => h === d || h.endsWith("." + d));
}

/** Returns a normalized URL if safe to fetch, else null. */
export function validateOutboundUrl(raw: string, allowed: readonly string[] = ALLOWED_TICKET_DOMAINS): URL | null {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > MAX_URL_LENGTH) return null;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  if (u.username || u.password) return null;
  if (u.port && u.port !== "443") return null;
  if (!isHostAllowed(u.hostname, allowed)) return null;
  return u;
}

/** Validates an extracted image URL (any public HTTPS host, no IP / local names). */
export function validateImageUrl(raw: string, base?: string): string | null {
  let s = (raw ?? "").trim();
  if (!s) return null;
  try {
    const u = base ? new URL(s, base) : new URL(s);
    if (u.protocol !== "https:" || u.username || u.password) return null;
    if (u.port && u.port !== "443") return null;
    const h = u.hostname.toLowerCase();
    if (!h.includes(".") || isIpLiteral(h) || h === "localhost") return null;
    if (LOCAL_SUFFIXES.some((x) => h.endsWith(x))) return null;
    s = u.toString();
    return s.length <= MAX_URL_LENGTH ? s : null;
  } catch {
    return null;
  }
}

export type SafeFetchOptions = {
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  allowed?: readonly string[];
  fetchImpl?: typeof fetch;
};

/** Fetches an HTML page safely. Returns text (truncated to maxBytes) or null. */
export async function safeFetchHtml(raw: string, opts: SafeFetchOptions = {}): Promise<{ html: string; finalUrl: string } | null> {
  const { timeoutMs = 5000, maxBytes = 512 * 1024, maxRedirects = 3, allowed = ALLOWED_TICKET_DOMAINS, fetchImpl = fetch } = opts;
  let current = validateOutboundUrl(raw, allowed);
  if (!current) return null;

  for (let hop = 0; hop <= maxRedirects; hop++) {
    let res: Response;
    try {
      res = await fetchImpl(current.toString(), {
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; TonightFRBot/1.0; +https://tonightfr.lovable.app)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } catch {
      return null;
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return null;
      let next: string;
      try {
        next = new URL(loc, current).toString();
      } catch {
        return null;
      }
      current = validateOutboundUrl(next, allowed);
      if (!current) return null;
      continue;
    }

    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml\+xml/i.test(ct)) return null;
    const len = Number(res.headers.get("content-length") ?? "0");
    if (len > maxBytes) return null;

    const html = await readLimited(res, maxBytes);
    return html === null ? null : { html, finalUrl: current.toString() };
  }
  return null;
}

async function readLimited(res: Response, maxBytes: number): Promise<string | null> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const room = maxBytes - total;
      if (value.byteLength >= room) {
        chunks.push(value.slice(0, room));
        total += room;
        await reader.cancel();
        break;
      }
      chunks.push(value);
      total += value.byteLength;
    }
  } catch {
    return null;
  }
  const buf = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    buf.set(c, off);
    off += c.byteLength;
  }
  return new TextDecoder().decode(buf);
}

export function extractOgImage(html: string, pageUrl: string): string | null {
  const head = html.slice(0, 120000);
  const patterns = [
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];
  for (const re of patterns) {
    const m = head.match(re);
    if (m?.[1]) {
      const v = validateImageUrl(m[1].startsWith("//") ? "https:" + m[1] : m[1], pageUrl);
      if (v) return v;
    }
  }
  return null;
}

/** Constant-time Bearer check against a server secret. */
export function bearerMatches(header: string | null, secret: string | undefined): boolean {
  if (!secret || !header || !header.startsWith("Bearer ")) return false;
  const enc = new TextEncoder();
  const a = enc.encode(header.slice(7));
  const b = enc.encode(secret);
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
