import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Map, Heart, CalendarX, Locate, LocateFixed, User as UserIcon, LogOut, Settings } from "lucide-react";
import heroImg from "@/assets/hero-night.jpg";
import logo from "@/assets/logo-tonight.png";
import ogImg from "@/assets/og-tonight.jpg";
import { type CategoryKey } from "@/data/events";
import { T, type Lang } from "@/data/i18n";
import { LanguageSwitcher } from "@/components/tonight/LanguageSwitcher";
import { CategoryChips } from "@/components/tonight/CategoryChips";
import { DateChips } from "@/components/tonight/DateChips";
import { SearchBar } from "@/components/tonight/SearchBar";
import { EventCard } from "@/components/tonight/EventCard";
import { EventCardSkeleton } from "@/components/tonight/EventCardSkeleton";
import { fetchEvents, type WhenFilter, type DbEvent } from "@/lib/events";
import { useFavorites } from "@/hooks/useFavorites";
import { useGeolocation, distanceKm } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tonight.fr — What's on tonight in Fribourg" },
      {
        name: "description",
        content:
          "Discover tonight's afterworks, concerts, clubbing, shisha, lounge bars, expos and live sports in Fribourg, Switzerland. Curated nightlife in FR / DE / EN.",
      },
      { property: "og:title", content: "Tonight.fr — Fribourg nightlife tonight" },
      {
        property: "og:description",
        content:
          "Everything happening in Fribourg tonight, at a glance. Afterwork, happy hour, concerts, clubbing, shisha, lounge, culture and sport.",
      },
      { property: "og:image", content: ogImg },
      { name: "twitter:image", content: ogImg },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [lang, setLang] = useState<Lang>("fr");
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [when, setWhen] = useState<WhenFilter>("tonight");
  const [search, setSearch] = useState("");
  const { has, toggle, count } = useFavorites();
  const geo = useGeolocation();

  const eventsQuery = useQuery({
    queryKey: ["events", when, active],
    queryFn: () => fetchEvents({ when, category: active }),
  });

  const events = useMemo(() => {
    let list: (DbEvent & { _distance?: number })[] = eventsQuery.data ?? [];
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.venue.toLowerCase().includes(term) ||
          e.area.toLowerCase().includes(term),
      );
    }
    if (geo.coords) {
      list = list
        .map((e) => ({
          ...e,
          _distance:
            e.lat != null && e.lng != null
              ? distanceKm(geo.coords!, { lat: e.lat, lng: e.lng })
              : Number.POSITIVE_INFINITY,
        }))
        .sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity));
    }
    return list;
  }, [eventsQuery.data, search, geo.coords]);

  const today = new Date().toLocaleDateString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );

  return (
    <div className="relative min-h-screen pb-32">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 drop-shadow-[0_0_12px_rgba(255,45,184,0.35)]"
            />
            <span className="font-display text-base font-semibold tracking-tight">
              Tonight<span className="text-gradient-neon">.fr</span>
            </span>
          </Link>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
      </header>

      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Fribourg by night"
            width={1280}
            height={1600}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-3xl px-5 pb-10">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {T[lang].nowLive} · {today}
              </div>
              <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight animate-fade-up sm:text-6xl">
                {T[lang].tonightIn}
                <br />
                <span className="text-gradient-neon">{T[lang].city}.</span>
              </h1>
              <p
                className="mt-3 max-w-md text-base text-muted-foreground animate-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                {T[lang].subtitle}
              </p>

              <div
                className="mt-6 flex flex-wrap gap-3 animate-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                <a
                  href="#events"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
                >
                  {events.length} {T[lang].events}
                </a>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold transition-colors hover:bg-surface-elevated"
                >
                  <Map className="h-4 w-4" />
                  {T[lang].seeMap}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Date + Category filter */}
      <section className="sticky top-[60px] z-30 glass-strong">
        <div className="mx-auto max-w-3xl space-y-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder={T[lang].searchPh} />
            </div>
            <button
              onClick={geo.coords ? geo.clear : geo.request}
              disabled={geo.loading}
              aria-label={T[lang].locateMe}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${
                geo.coords
                  ? "bg-gradient-aurora text-primary-foreground shadow-neon"
                  : "glass hover:bg-surface-elevated"
              }`}
            >
              {geo.coords ? <LocateFixed className="h-4 w-4" /> : <Locate className="h-4 w-4" />}
            </button>
          </div>
          <DateChips active={when} onChange={setWhen} lang={lang} />
          <CategoryChips active={active} onChange={setActive} lang={lang} />
        </div>
      </section>

      <main id="events" className="mx-auto max-w-3xl px-5 pt-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{T[lang][whenLabelKey(when)]}</h2>
          <span className="text-sm tabular-nums text-muted-foreground">
            {events.length} {T[lang].events}
          </span>
        </div>

        {eventsQuery.isLoading ? (
          <div className="grid gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl glass py-14 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-elevated">
              <CalendarX className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{T[lang].noEvents}</p>
            <button
              onClick={() => setWhen("all")}
              className="mt-1 rounded-full bg-gradient-aurora px-4 py-2 text-xs font-semibold text-primary-foreground shadow-neon"
            >
              {T[lang].fAll}
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {events.map((e, i) => (
              <EventCard
                key={e.id}
                event={e}
                lang={lang}
                index={i}
                isFav={has(e.id)}
                onToggleFav={toggle}
              />
            ))}
          </div>
        )}

        <footer className="mt-16 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-foreground">
              À propos
            </Link>
            <span>·</span>
            <Link to="/legal" className="hover:text-foreground">
              Mentions légales
            </Link>
          </div>
          <p>{T[lang].footer}</p>
        </footer>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-5">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full glass-strong p-1.5 shadow-elevated">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-neon"
          >
            <Map className="h-4 w-4" /> {T[lang].map}
          </Link>
          <button className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface">
            <Heart className="h-4 w-4" />
            {count > 0 && <span className="tabular-nums text-primary">{count}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function whenLabelKey(w: WhenFilter): string {
  return w === "tonight"
    ? "fTonight"
    : w === "tomorrow"
      ? "fTomorrow"
      : w === "weekend"
        ? "fWeekend"
        : "fAll";
}
