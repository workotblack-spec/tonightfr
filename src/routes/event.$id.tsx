import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Heart, MapPin, Share2, Ticket } from "lucide-react";
import { useState } from "react";
import { fetchEventById } from "@/lib/events";
import { CATEGORIES } from "@/data/events";
import { imageFor } from "@/data/eventImages";
import { T, type Lang } from "@/data/i18n";
import { useFavorites } from "@/hooks/useFavorites";
import { LanguageSwitcher } from "@/components/tonight/LanguageSwitcher";

export const Route = createFileRoute("/event/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Tonight FR — Event ${params.id}` },
      { name: "description", content: "Détails de l'événement à Fribourg." },
    ],
  }),
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
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-sm text-muted-foreground">{error.message}</p>
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

  const q = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const ev = await fetchEventById(id);
      if (!ev) throw notFound();
      return ev;
    },
  });

  if (q.isLoading) {
    return <div className="py-20 text-center text-muted-foreground">{T[lang].loading}</div>;
  }
  if (!q.data) return null;
  const ev = q.data;
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
    image: imageFor(ev.image_key),
    description: ev.description || `${ev.venue} · ${ev.area}`,
    ...(ev.ticket_url ? { offers: { "@type": "Offer", url: ev.ticket_url, price: ev.price_text || "0" } } : {}),
  };

  return (
    <div className="relative min-h-screen pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> {T[lang].back}
          </Link>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
      </header>

      <section className="relative">
        <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
          <img
            src={imageFor(ev.image_key)}
            alt={ev.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-5 pb-8">
            {cat && (
              <div className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-aurora" />
                {cat.label[lang]}
              </div>
            )}
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {ev.title}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              {ev.venue} · {ev.area}
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-5 pt-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={<Calendar className="h-4 w-4 text-primary" />} label={T[lang].when}>
            <div className="capitalize">{dateStr}</div>
            <div className="text-muted-foreground">{timeStr}</div>
          </InfoRow>
          <InfoRow icon={<MapPin className="h-4 w-4 text-primary" />} label={T[lang].address}>
            <div>{ev.venue}</div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              {T[lang].openMap} →
            </a>
          </InfoRow>
        </div>

        {ev.description && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">{T[lang].aboutEvent}</h2>
            <p className="mt-2 leading-relaxed text-foreground/90">{ev.description}</p>
          </section>
        )}

        {ev.lineup && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">{T[lang].lineup}</h2>
            <p className="mt-2 leading-relaxed text-foreground/90">{ev.lineup}</p>
          </section>
        )}

        {ev.price_text && (
          <div className="mt-8 rounded-2xl glass p-4 text-sm">
            <span className="font-semibold">{ev.price_text}</span>
          </div>
        )}
      </main>

      {/* Floating actions */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-5">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full glass-strong p-1.5 shadow-elevated">
          <button
            onClick={() => toggle(ev.id)}
            aria-label={isFav ? T[lang].removeFav : T[lang].addToFav}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : ""}`} />
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
          >
            <Share2 className="h-4 w-4" />
            {T[lang].share}
          </button>
          {ev.ticket_url && (
            <a
              href={ev.ticket_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-neon"
            >
              <Ticket className="h-4 w-4" /> {T[lang].getTickets}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl glass p-4">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
}
