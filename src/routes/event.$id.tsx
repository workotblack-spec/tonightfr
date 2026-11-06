import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Heart, MapPin, Share2, Ticket } from "lucide-react";
import { useState } from "react";
import { getPublicEvent } from "@/lib/public-events.functions";
import { CATEGORIES } from "@/data/events";
import { imageFor } from "@/data/eventImages";
import { proxied } from "@/lib/image";
import { resolveEventImage } from "@/data/venuePhotos";
import { T, type Lang } from "@/data/i18n";
import { useFavorites } from "@/hooks/useFavorites";
import { LanguageSwitcher } from "@/components/tonight/LanguageSwitcher";
import { VipTableRequest } from "@/components/tonight/VipTableRequest";
import { HouseRules } from "@/components/tonight/HouseRules";

const eventQueryOptions = (id: string) => queryOptions({
  queryKey: ["event", id],
  queryFn: async () => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw notFound();
    const event = await getPublicEvent({ data: { id } });
    if (!event) throw notFound();
    return event;
  },
});

export const Route = createFileRoute("/event/$id")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(eventQueryOptions(params.id)),
  head: ({ params, loaderData }) => {
    const title = loaderData ? `${loaderData.title} — ${loaderData.venue} | Tonight FR` : "Événement introuvable — Tonight FR";
    const description = loaderData ? (loaderData.description || `${loaderData.venue} · ${loaderData.area}`).slice(0, 160) : "Cet événement n’est pas disponible.";
    const url = `https://tonightfr.lovable.app/event/${encodeURIComponent(params.id)}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: EventDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="font-display text-3xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Événement introuvable.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
        Retour
      </Link>
    </div>
  ),
  errorComponent: function EventError({ error, reset }) {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-4 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
        >
          Réessayer
        </button>
      </div>
    );
  },
});

function EventDetail() {
  const { id } = Route.useParams();
  const [lang, setLang] = useState<Lang>("fr");
  const { has, toggle } = useFavorites();

  const { data: ev } = useSuspenseQuery(eventQueryOptions(id));
  const cat = CATEGORIES.find((c) => c.key === ev.category);
  const date = new Date(ev.starts_at);
  const dateStr = date.toLocaleDateString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );
  const timeStr = date.toLocaleTimeString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { hour: "2-digit", minute: "2-digit" },
  );
  const isFav = has(ev.id);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${ev.venue} ${ev.area} Fribourg Switzerland`,
  )}`;

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: ev.title, text: `${ev.venue} · ${dateStr} ${timeStr}`, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const isHttpUrl = (u?: string | null) => !!u && /^https?:\/\//i.test(u);
  const safeTicketUrl = isHttpUrl(ev.ticket_url) ? ev.ticket_url : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: ev.title,
    startDate: date.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ev.venue,
      address: ev.address || `${ev.area}, Fribourg, Switzerland`,
      ...(ev.lat && ev.lng ? { geo: { "@type": "GeoCoordinates", latitude: ev.lat, longitude: ev.lng } } : {}),
    },
    image: resolveEventImage(ev.id, ev.venue, ev.image_url) || imageFor(ev.image_key),
    description: ev.description || `${ev.venue} · ${ev.area}`,
    ...(safeTicketUrl ? { offers: { "@type": "Offer", url: safeTicketUrl, price: ev.price_text || "0" } } : {}),
  };

  // Escape </script> and < to prevent XSS via JSON-LD injection
  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div className="relative min-h-screen pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd }} />
      <section className="relative">
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-surface">
          <img
            src={(() => {
              const r = resolveEventImage(ev.id, ev.venue, ev.image_url);
              return r ? proxied(r, 1600) : imageFor(ev.image_key);
            })()}
            alt={ev.title}
            onError={(e) => {
              const img = e.currentTarget;
              const fb = imageFor(ev.image_key);
              if (img.src !== fb) img.src = fb;
            }}
            className="h-full w-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 top-0 mx-auto flex max-w-3xl items-center justify-between px-5 pt-4">
            <Link to="/" aria-label={T[lang].back} className="press grid h-10 w-10 place-items-center rounded-full bg-background/60 backdrop-blur-md">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher lang={lang} onChange={setLang} />
              <button onClick={share} aria-label={T[lang].share} className="press grid h-10 w-10 place-items-center rounded-full bg-background/60 backdrop-blur-md">
                <Share2 className="h-4 w-4" />
              </button>
              <button onClick={() => toggle(ev.id)} aria-label={isFav ? T[lang].removeFav : T[lang].addToFav} className="press grid h-10 w-10 place-items-center rounded-full bg-background/60 backdrop-blur-md">
                <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-8 animate-fade-up">
            {cat && <p className="label-xs text-primary">{cat.label[lang]}</p>}
            <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              {ev.title}
            </h1>
            <p className="mt-3 text-[15px] text-foreground/75">
              <span className="capitalize">{dateStr}</span> · <span className="tabular-nums">{timeStr}</span>
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-5 pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={<Calendar className="h-4 w-4" strokeWidth={1.75} />} label={T[lang].when}>
            <div className="capitalize">{dateStr}</div>
            <div className="font-display text-xl font-semibold tabular-nums text-primary">{timeStr}</div>
          </InfoRow>
          <InfoRow icon={<MapPin className="h-4 w-4" strokeWidth={1.75} />} label={T[lang].venue}>
            <div className="font-medium">{ev.venue}</div>
            <div className="text-muted-foreground">{ev.address || ev.area}</div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-primary hover:underline">
              {T[lang].openMap} →
            </a>
          </InfoRow>
        </div>

        {ev.price_text && (
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-surface/60 px-4 py-3.5 text-sm">
            <span className="label-xs text-muted-foreground">{T[lang].price}</span>
            <span className="font-semibold">{ev.price_text}</span>
          </div>
        )}

        {ev.description && (
          <section className="mt-10">
            <div className="divider-gold mb-6" />
            <h2 className="font-display text-xl font-semibold tracking-tight">{T[lang].aboutEvent}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{ev.description}</p>
          </section>
        )}

        {ev.lineup && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold tracking-tight">{T[lang].lineup}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{ev.lineup}</p>
          </section>
        )}

        {ev.lat != null && ev.lng != null && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold tracking-tight">{T[lang].address}</h2>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-2xl border border-border">
              <iframe
                title="map"
                loading="lazy"
                className="pointer-events-none h-56 w-full grayscale invert-[0.92] hue-rotate-180"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${ev.lng - 0.006},${ev.lat - 0.004},${ev.lng + 0.006},${ev.lat + 0.004}&layer=mapnik&marker=${ev.lat},${ev.lng}`}
              />
            </a>
          </section>
        )}

        {(ev.category === "clubbing" || ev.category === "lounge" || ev.category === "shisha") && (
          <>
            <HouseRules venue={ev.venue} />
            <VipTableRequest eventId={ev.id} venue={ev.venue} />
          </>
        )}
      </main>

      {/* CTA fixe */}
      <div className="fixed inset-x-0 bottom-0 z-40 glass-strong safe-bottom">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{ev.venue}</p>
            <p className="text-xs tabular-nums text-muted-foreground">{timeStr}{ev.price_text ? ` · ${ev.price_text}` : ""}</p>
          </div>
          {safeTicketUrl ? (
            <a href={safeTicketUrl} target="_blank" rel="noreferrer" className="press inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <Ticket className="h-4 w-4" /> {T[lang].getTickets}
            </a>
          ) : (
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="press inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
              <MapPin className="h-4 w-4" /> {T[lang].openMap}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4">
      <div className="label-xs flex items-center gap-2 text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-3 space-y-0.5 text-sm">{children}</div>
    </div>
  );
}
