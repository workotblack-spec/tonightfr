import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Locate, LocateFixed } from "lucide-react";
import { fetchEvents, type WhenFilter } from "@/lib/events";
import { CATEGORIES, type CategoryKey } from "@/data/events";
import { T, type Lang } from "@/data/i18n";
import { CategoryChips } from "@/components/tonight/CategoryChips";
import { DateChips } from "@/components/tonight/DateChips";
import { LanguageSwitcher } from "@/components/tonight/LanguageSwitcher";
import { useGeolocation } from "@/hooks/useGeolocation";

// Leaflet must be loaded client-side only (depends on `window`).
const MapView = lazy(() =>
  import("@/components/tonight/MapView").then((m) => ({ default: m.MapView })),
);

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Carte — Tonight.fr Fribourg" },
      {
        name: "description",
        content:
          "Carte interactive des événements de la nuit à Fribourg : afterworks, concerts, clubbing, shisha, lounge, culture et sport.",
      },
      { property: "og:title", content: "Carte des événements — Tonight.fr" },
      { property: "og:url", content: "/map" },
    ],
    links: [{ rel: "canonical", href: "/map" }],
  }),
  component: MapPage,
});

function MapPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const [when, setWhen] = useState<WhenFilter>("tonight");
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [mounted, setMounted] = useState(false);
  const geo = useGeolocation();

  useEffect(() => setMounted(true), []);

  const q = useQuery({
    queryKey: ["events", when, active],
    queryFn: () => fetchEvents({ when, category: active }),
  });

  const events = useMemo(() => q.data ?? [], [q.data]);
  const geolocated = events.filter((e) => e.lat != null && e.lng != null);

  return (
    <div className="relative min-h-screen pb-6">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> {T[lang].back}
          </Link>
          <h1 className="font-display text-base font-semibold">
            {T[lang].map} · <span className="text-gradient-neon">{T[lang].city}</span>
          </h1>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
      </header>

      <section className="sticky top-[60px] z-30 glass-strong">
        <div className="mx-auto max-w-5xl space-y-3 px-5 py-3">
          <DateChips active={when} onChange={setWhen} lang={lang} />
          <CategoryChips active={active} onChange={setActive} lang={lang} />
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-5 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {geolocated.length} {T[lang].events}
          </p>
          <button
            onClick={geo.request}
            disabled={geo.loading}
            className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-surface-elevated disabled:opacity-50"
          >
            {geo.coords ? <LocateFixed className="h-3.5 w-3.5 text-primary" /> : <Locate className="h-3.5 w-3.5" />}
            {geo.loading ? "…" : geo.coords ? T[lang].nearMe : T[lang].locateMe}
          </button>
        </div>

        {mounted ? (
          <Suspense
            fallback={
              <div className="grid h-[420px] place-items-center rounded-2xl glass text-sm text-muted-foreground">
                {T[lang].loading}
              </div>
            }
          >
            <MapView events={geolocated} userCoords={geo.coords} lang={lang} />
          </Suspense>
        ) : (
          <div className="grid h-[420px] place-items-center rounded-2xl glass text-sm text-muted-foreground">
            {T[lang].loading}
          </div>
        )}

        {geo.error && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {T[lang].geoError}
          </p>
        )}
      </main>
    </div>
  );
}
