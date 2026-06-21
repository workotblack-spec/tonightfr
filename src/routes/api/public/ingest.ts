import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Sources to scrape — Fribourg nightlife & culture
const SOURCES: { id: string; url: string; defaultVenue: string; defaultArea: string; defaultCategory: string; defaultImage: string; lat?: number; lng?: number; address?: string }[] = [
  {
    id: "frison",
    url: "https://fri-son.ch/programme/",
    defaultVenue: "Fri-Son",
    defaultArea: "Fribourg",
    defaultCategory: "concert",
    defaultImage: "concert",
    lat: 46.8023,
    lng: 7.1467,
    address: "Route de la Fonderie 13, 1700 Fribourg",
  },
  {
    id: "nouveaumonde",
    url: "https://www.nouveaumonde.ch/agenda/",
    defaultVenue: "Le Nouveau Monde",
    defaultArea: "Fribourg",
    defaultCategory: "concert",
    defaultImage: "concert",
    lat: 46.8011,
    lng: 7.1503,
    address: "Esplanade de l'Ancienne-Gare 3, 1700 Fribourg",
  },
  {
    id: "fribourgtourisme",
    url: "https://www.fribourgtourisme.ch/fr/agenda.html",
    defaultVenue: "Fribourg",
    defaultArea: "Fribourg",
    defaultCategory: "culture",
    defaultImage: "culture",
    lat: 46.8065,
    lng: 7.1619,
  },
  {
    id: "belluard",
    url: "https://www.belluard.ch/fr/programme",
    defaultVenue: "Belluard Bollwerk",
    defaultArea: "Fribourg",
    defaultCategory: "culture",
    defaultImage: "culture",
    lat: 46.8048,
    lng: 7.1530,
    address: "Derrière-les-Remparts 1a, 1700 Fribourg",
  },
  {
    id: "equilibre",
    url: "https://www.equilibre-nuithonie.ch/agenda",
    defaultVenue: "Equilibre / Nuithonie",
    defaultArea: "Fribourg",
    defaultCategory: "culture",
    defaultImage: "culture",
    lat: 46.8033,
    lng: 7.1498,
    address: "Place Jean-Tinguely 1, 1700 Fribourg",
  },
  {
    id: "badbonn",
    url: "https://badbonn.ch/de/programm/",
    defaultVenue: "Bad Bonn",
    defaultArea: "Düdingen",
    defaultCategory: "concert",
    defaultImage: "concert",
    lat: 46.8478,
    lng: 7.1922,
    address: "Seestrasse 50, 3186 Düdingen",
  },
  {
    id: "lacave",
    url: "https://www.lacave.ch/agenda",
    defaultVenue: "La Cave",
    defaultArea: "Fribourg",
    defaultCategory: "clubbing",
    defaultImage: "club",
    lat: 46.8060,
    lng: 7.1612,
  },
  {
    id: "loyaute",
    url: "https://www.cafedelaloyaute.ch/agenda",
    defaultVenue: "Café de la Loyauté",
    defaultArea: "Fribourg",
    defaultCategory: "afterwork",
    defaultImage: "bar",
    lat: 46.8052,
    lng: 7.1601,
  },
  // ===== Lausanne =====
  {
    id: "docks",
    url: "https://www.lesdocks.ch/programme",
    defaultVenue: "Les Docks",
    defaultArea: "Lausanne",
    defaultCategory: "concert",
    defaultImage: "concert",
    lat: 46.5189,
    lng: 6.6225,
    address: "Avenue de Sévelin 34, 1004 Lausanne",
  },
  {
    id: "mad",
    url: "https://www.mad.ch/programme",
    defaultVenue: "MAD Club",
    defaultArea: "Lausanne",
    defaultCategory: "clubbing",
    defaultImage: "club",
    lat: 46.5197,
    lng: 6.6322,
    address: "Rue de Genève 23, 1003 Lausanne",
  },
  {
    id: "dolce",
    url: "https://www.dolcevita.ch/agenda",
    defaultVenue: "D! Club",
    defaultArea: "Lausanne",
    defaultCategory: "clubbing",
    defaultImage: "club",
    lat: 46.5210,
    lng: 6.6336,
    address: "Place Centrale 3, 1003 Lausanne",
  },
  {
    id: "romandie",
    url: "https://www.laromandie.ch/programme",
    defaultVenue: "La Romandie",
    defaultArea: "Lausanne",
    defaultCategory: "concert",
    defaultImage: "concert",
    lat: 46.5180,
    lng: 6.6298,
    address: "Place de l'Europe 1A, 1003 Lausanne",
  },
  {
    id: "fondation-arts",
    url: "https://www.fondation-hermitage.ch/agenda",
    defaultVenue: "Fondation de l'Hermitage",
    defaultArea: "Lausanne",
    defaultCategory: "culture",
    defaultImage: "culture",
    lat: 46.5300,
    lng: 6.6420,
    address: "Route du Signal 2, 1018 Lausanne",
  },
  {
    id: "lausanne-tourisme",
    url: "https://www.lausanne-tourisme.ch/fr/agenda/",
    defaultVenue: "Lausanne",
    defaultArea: "Lausanne",
    defaultCategory: "culture",
    defaultImage: "culture",
    lat: 46.5197,
    lng: 6.6323,
  },
  {
    id: "great-escape",
    url: "https://www.the-great.ch/agenda",
    defaultVenue: "Great Escape",
    defaultArea: "Lausanne",
    defaultCategory: "afterwork",
    defaultImage: "bar",
    lat: 46.5217,
    lng: 6.6336,
    address: "Rue Madeleine 18, 1003 Lausanne",
  },
  // ===== Bulle / Gruyère =====
  {
    id: "ebullition",
    url: "https://www.ebull.ch/programme/",
    defaultVenue: "Ebullition",
    defaultArea: "Bulle",
    defaultCategory: "concert",
    defaultImage: "concert",
    lat: 46.6189,
    lng: 7.0567,
    address: "Rue de Vevey 5, 1630 Bulle",
  },
  {
    id: "co2bulle",
    url: "https://www.co2bulle.ch/agenda/",
    defaultVenue: "CO2",
    defaultArea: "Bulle",
    defaultCategory: "clubbing",
    defaultImage: "club",
    lat: 46.6173,
    lng: 7.0581,
    address: "Rue de Vevey 21, 1630 Bulle",
  },
  {
    id: "lagruyere",
    url: "https://www.la-gruyere.ch/agenda/",
    defaultVenue: "La Gruyère",
    defaultArea: "Bulle",
    defaultCategory: "culture",
    defaultImage: "culture",
    lat: 46.6167,
    lng: 7.0561,
  },
  // ===== Fribourg complément =====
  {
    id: "laspirale",
    url: "https://laspirale.ch/agenda/",
    defaultVenue: "La Spirale",
    defaultArea: "Fribourg",
    defaultCategory: "clubbing",
    defaultImage: "club",
    lat: 46.8068,
    lng: 7.1568,
    address: "Place Petit-Saint-Jean 39, 1700 Fribourg",
  },
];


const ALLOWED_CATEGORIES = [
  "afterwork",
  "happyhour",
  "concert",
  "clubbing",
  "culture",
  "sport",
  "shisha",
  "lounge",
] as const;

const ALLOWED_IMAGES = ["club", "bar", "concert", "culture", "sport", "afterwork"] as const;

type ParsedEvent = {
  title: string;
  starts_at: string; // ISO
  category: (typeof ALLOWED_CATEGORIES)[number];
  image_key: (typeof ALLOWED_IMAGES)[number];
  description?: string;
  lineup?: string;
  price_text?: string;
  ticket_url?: string;
  external_slug: string;
};

async function firecrawlScrape(url: string): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY missing");
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
      waitFor: 1500,
    }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: { markdown?: string }; markdown?: string };
  return json.data?.markdown ?? json.markdown ?? "";
}

async function aiExtract(markdown: string, sourceId: string, defaults: { category: string; image: string }): Promise<ParsedEvent[]> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const currentYear = new Date().getFullYear();
  const prompt = `You are an event extractor for a Swiss nightlife & culture app (Fribourg + Lausanne). From the page content below, extract upcoming events.

Rules:
- Only include events in the next 90 days. Today is ${new Date().toISOString().slice(0, 10)}.
- starts_at must be ISO 8601 with timezone (assume Europe/Zurich, +01:00 or +02:00 for summer).
- If only a date is given, use 20:00 local time.
- Year defaults to ${currentYear} or ${currentYear + 1} if the month already passed.
- category MUST be one of: ${ALLOWED_CATEGORIES.join(", ")}. Default: ${defaults.category}.
- image_key MUST be one of: ${ALLOWED_IMAGES.join(", ")}. Default: ${defaults.image}.
- external_slug: short kebab-case unique key derived from title+date (e.g. "artist-name-2026-03-15").
- Return ONLY valid JSON, no prose.

Page content:
---
${markdown.slice(0, 25000)}
---`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      tools: [
        {
          type: "function",
          function: {
            name: "save_events",
            description: "Save extracted events",
            parameters: {
              type: "object",
              properties: {
                events: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      starts_at: { type: "string" },
                      category: { type: "string", enum: [...ALLOWED_CATEGORIES] },
                      image_key: { type: "string", enum: [...ALLOWED_IMAGES] },
                      description: { type: "string" },
                      lineup: { type: "string" },
                      price_text: { type: "string" },
                      ticket_url: { type: "string" },
                      external_slug: { type: "string" },
                    },
                    required: ["title", "starts_at", "category", "image_key", "external_slug"],
                  },
                },
              },
              required: ["events"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "save_events" } },
    }),
  });

  if (!res.ok) throw new Error(`AI gateway ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
  };
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) return [];
  try {
    const parsed = JSON.parse(args) as { events?: ParsedEvent[] };
    return parsed.events ?? [];
  } catch {
    return [];
  }
}

async function ingestSource(source: (typeof SOURCES)[number]) {
  const md = await firecrawlScrape(source.url);
  if (!md || md.length < 100) return { source: source.id, scraped: 0, upserted: 0, skipped: "no content" };

  const events = await aiExtract(md, source.id, {
    category: source.defaultCategory,
    image: source.defaultImage,
  });

  let upserted = 0;
  const errors: string[] = [];
  for (const ev of events) {
    if (!ev.title || !ev.starts_at || !ev.external_slug) continue;
    // Validate ticket_url scheme to prevent javascript:/data: URL injection
    const safeTicketUrl =
      ev.ticket_url && /^https?:\/\//i.test(ev.ticket_url) ? ev.ticket_url : null;
    const externalId = `${source.id}:${ev.external_slug}`;
    const { error } = await supabaseAdmin
      .from("events")
      .upsert(
        {
          external_id: externalId,
          title: ev.title.slice(0, 200),
          venue: source.defaultVenue,
          area: source.defaultArea,
          category: ALLOWED_CATEGORIES.includes(ev.category) ? ev.category : source.defaultCategory,
          starts_at: ev.starts_at,
          image_key: ALLOWED_IMAGES.includes(ev.image_key) ? ev.image_key : source.defaultImage,
          description: ev.description ?? null,
          lineup: ev.lineup ?? null,
          price_text: ev.price_text ?? null,
          ticket_url: safeTicketUrl,
          address: source.address ?? null,
          lat: source.lat ?? null,
          lng: source.lng ?? null,
        },
        { onConflict: "external_id" },
      );
    if (error) errors.push(error.message);
    else upserted++;
  }
  return { source: source.id, scraped: events.length, upserted, errors: errors.slice(0, 3) };
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export const Route = createFileRoute("/api/public/ingest")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const results = [];
        for (const s of SOURCES) {
          try {
            results.push(await ingestSource(s));
          } catch (e) {
            results.push({ source: s.id, error: e instanceof Error ? e.message : String(e) });
          }
        }
        return Response.json({ ok: true, ranAt: new Date().toISOString(), results });
      },
    },
  },
});

